import { useQuery } from '@tanstack/react-query';
import { Root } from './response.dto';

const BASE_URL = 'https://world.openpetfoodfacts.org/api/v2/product';

export const fetchProductByBarcode = async (barcode: string): Promise<Root> => {
  if (!barcode) {
    throw new Error('Barcode is required');
  }
  
  const response = await fetch(`${BASE_URL}/${barcode}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  
  // The API might return 200 even if product is not found, with status: 0
  if (data.status === 0) {
    throw new Error('Product not found');
  }
  
  return data;
};

export const useProductByBarcode = (barcode: string) => {
  return useQuery({
    queryKey: ['open-pet-food-facts', 'product', barcode],
    queryFn: () => fetchProductByBarcode(barcode),
    enabled: !!barcode && barcode.length >= 8, // Only fetch if barcode is reasonably long
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
