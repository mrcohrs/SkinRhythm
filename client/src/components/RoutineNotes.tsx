import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Note {
  id: string;
  date: string;
  text: string;
}

interface RoutineNotesProps {
  routineId: string;
  notes?: Note[];
}

export function RoutineNotes({ routineId, notes = [] }: RoutineNotesProps) {
  const { toast } = useToast();
  const [noteText, setNoteText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addNoteMutation = useMutation({
    mutationFn: async (text: string) => {
      return await apiRequest('POST', `/api/routines/${routineId}/add-note`, { text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routines/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] });
      setNoteText("");
      setIsAdding(false);
      toast({
        title: "Note added",
        description: "Your note has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      return await apiRequest('DELETE', `/api/routines/${routineId}/notes/${noteId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routines/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] });
      toast({
        title: "Note deleted",
        description: "Your note has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNoteMutation.mutate(noteText.trim());
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNoteMutation.mutate(noteId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">My Notes</h3>
        </div>
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            data-testid="button-add-note"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <Card className="border-primary/20">
          <CardContent className="p-4 space-y-3">
            <Textarea
              placeholder="Add a note about this routine (e.g., how your skin is responding, products you love, side effects you're experiencing...)"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-note"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddNote}
                disabled={!noteText.trim() || addNoteMutation.isPending}
                data-testid="button-save-note"
              >
                {addNoteMutation.isPending ? "Saving..." : "Save Note"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNoteText("");
                  setIsAdding(false);
                }}
                data-testid="button-cancel-note"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} className="border-card-border" data-testid={`note-${note.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(note.date), "MMM dd, yyyy 'at' h:mm a")}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={deleteNoteMutation.isPending}
                    className="flex-shrink-0"
                    data-testid={`button-delete-note-${note.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !isAdding && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No notes yet. Click "Add Note" to start tracking your journey!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
