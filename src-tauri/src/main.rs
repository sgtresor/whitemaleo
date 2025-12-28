#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use tauri::command;

// Define the structure of the request coming from Svelte
#[derive(serde::Deserialize)]
struct HttpRequest {
    method: String,
    url: String,
    headers: HashMap<String, String>,
    body: Option<String>,
}

// The Command: This is callable from your Svelte frontend
#[command]
async fn make_request(request: HttpRequest) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    // 1. Select Method
    let mut builder = match request.method.as_str() {
        "GET"    => client.get(&request.url),
        "POST"   => client.post(&request.url),
        "PUT"    => client.put(&request.url),
        "DELETE" => client.delete(&request.url),
        "PATCH"  => client.patch(&request.url),
        _        => return Err(format!("Unsupported method: {}", request.method)),
    };

    // 2. Add Headers
    for (key, value) in request.headers {
        builder = builder.header(key, value);
    }

    // 3. Add Body (if present)
    if let Some(body_text) = request.body {
        builder = builder.body(body_text);
    }

    // 4. Send and Await Response
    match builder.send().await {
        Ok(response) => {
            // Get text content (JSON or HTML)
            match response.text().await {
                Ok(text) => Ok(text),
                Err(e) => Err(format!("Failed to read response body: {}", e)),
            }
        }
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![make_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}