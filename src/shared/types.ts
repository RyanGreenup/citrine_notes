// Define the Note interface to match the database schema
export interface Note {
  id: string
  title: string
  body: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

// Define the Folder interface to match the database schema
export interface Folder {
  id: string
  title: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

// Define the Tag interface to match the database schema
export interface Tag {
  id: string
  title: string
  parent_id: string
  user_created_time: number
  user_updated_time: number
}

// Define the Resource interface to match the database schema
export interface Resource {
  id: string
  title: string
  mime: string
  filename: string
  created_time: number
  updated_time: number
  user_created_time: number
  user_updated_time: number
  file_extension: string
  encryption_cipher_text: string
  encryption_applied: number
  encryption_blob_encrypted: number
  size: number
  is_shared: number
  share_id: string
  master_key_id: string
  user_data: string
  blob_updated_time: number
  ocr_text: string
  ocr_details: string
  ocr_status: number
  ocr_error: string
}
