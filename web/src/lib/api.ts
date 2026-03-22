export interface GenerateResponse {
  job_id: string;
  preview_url: string;
  answer_url: string;
  pdf_url: string;
}

export async function generatePuzzle(
  image: File,
  gridSize: string,
  title: string,
  subtitle: string,
  orientation: string = "portrait"
): Promise<GenerateResponse> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("grid_size", gridSize);
  formData.append("title", title);
  formData.append("subtitle", subtitle);
  formData.append("orientation", orientation);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to generate puzzle.");
  }

  const result: GenerateResponse = await response.json();
  
  // Make URLs absolute if they are relative
  return {
    job_id: result.job_id,
    preview_url: baseUrl + result.preview_url,
    answer_url: baseUrl + result.answer_url,
    pdf_url: baseUrl + result.pdf_url,
  };
}
