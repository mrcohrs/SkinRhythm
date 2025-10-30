// Product images: SKU-based images for default products, category-based fallbacks
import cleanserImg from "@assets/Cleanser_1760341831448.png";
import tonerImg from "@assets/Toner_1760341831459.png";
import serumImg from "@assets/acid_1760944347974.png";
import hydratorImg from "@assets/hydra_1760944347978.png";
import moisturizerImg from "@assets/Moisturizer_1760341636653.png";
import spfImg from "@assets/SPF_1760341636654.png";
import spotTreatmentImg from "@assets/bpooo_1760944347978.png";
import iceGlobesImg from "@assets/ciice_1760874110365.png";

// SKU-based product images (for isDefault=true products)
import AC1Img from "@assets/AC-1.png";
import B11Img from "@assets/B1-1.png";
import B21Img from "@assets/B2-1.png";
import B51Img from "@assets/B5-1.png";
import CC3Img from "@assets/CC-3.png";
import CS1Img from "@assets/CS-1.png";
import ES1Img from "@assets/ES-1.png";
import GC2Img from "@assets/GC-2.png";
import HM1Img from "@assets/HM-1.png";
import HS1Img from "@assets/HS-1.png";
import LM1Img from "@assets/LM-1.png";
import MS1Img from "@assets/MS-1.png";
import MSFS2Img from "@assets/MSFS-2.png";
import MT2Img from "@assets/MT-2.png";
import RET1Img from "@assets/RET-1.png";
import RS1Img from "@assets/RS-1.png";
import RT2Img from "@assets/RT-2.png";
import ST1Img from "@assets/ST-1.png";
import VS1Img from "@assets/VS-1.png";

// SKU to image mapping for default products
const skuImages: Record<string, string> = {
  'AC-1': AC1Img,
  'B1-1': B11Img,
  'B2-1': B21Img,
  'B5-1': B51Img,
  'CC-3': CC3Img,
  'CS-1': CS1Img,
  'ES-1': ES1Img,
  'GC-2': GC2Img,
  'HM-1': HM1Img,
  'HS-1': HS1Img,
  'LM-1': LM1Img,
  'MS-1': MS1Img,
  'MSFS-2': MSFS2Img,
  'MT-2': MT2Img,
  'RET-1': RET1Img,
  'RS-1': RS1Img,
  'RT-2': RT2Img,
  'ST-1': ST1Img,
  'VS-1': VS1Img,
};

// Category-based fallback images
const categoryImages: Record<string, string> = {
  'Cleanser': cleanserImg,
  'Toner': tonerImg,
  'Serum': serumImg,
  'Hydrator': hydratorImg,
  'Moisturizer': moisturizerImg,
  'SPF': spfImg,
  'Treatment': spotTreatmentImg,
  'Tool': iceGlobesImg,
};

/**
 * Get product image path based on SKU (if available) or fallback to category image
 * @param sku - Product SKU (e.g., "AC-1")
 * @param category - Product category for fallback (e.g., "Cleanser")
 * @returns Image path to use for the product
 */
export function getProductImage(sku: string | undefined, category: string): string {
  // If SKU is provided and we have an image for it, use SKU-based image
  if (sku && skuImages[sku]) {
    return skuImages[sku];
  }
  
  // Otherwise, fallback to category-based image
  return categoryImages[category] || categoryImages['Serum'];
}
