export interface CloudinaryUploadInfo {
  secure_url: string;
  public_id: string;
  bytes: number;
  height: number;
  width: number;
  format: string;
  resource_type: string;
  colors?: Array<{ color: string; percentage: number }>;
}
