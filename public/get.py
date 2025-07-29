#!/usr/bin/env python3
"""
Python script to fetch JSON data from the Next.js API endpoint.
This script replicates the functionality of your API route.
"""

import requests
import json
import base64
import time
from typing import Any, Dict, Optional
from datetime import datetime, timedelta

class APIDataFetcher:
    def __init__(self, base_url: str = None):
        """
        Initialize the API data fetcher.
        
        Args:
            base_url: Base URL of your Next.js application (optional)
        """
        self.base_url = base_url
        self.cached_data: Optional[Dict[Any, Any]] = None
        self.cache_timestamp: float = 0
        self.cache_duration = 24 * 60 * 60  # 24 hours in seconds
        
    def fetch_from_nextjs_api(self) -> Dict[Any, Any]:
        """
        Fetch data from your Next.js API endpoint.
        
        Returns:
            JSON data from the API
        """
        if not self.base_url:
            raise ValueError("Base URL is required to fetch from Next.js API")
            
        url = f"{self.base_url}/api/your-endpoint"  # Replace with your actual endpoint
        
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Check cache status from headers
            cache_status = response.headers.get('X-Cache', 'UNKNOWN')
            print(f"Cache Status: {cache_status}")
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching from Next.js API: {e}")
            raise
    
    def fetch_directly_from_github(self) -> Dict[Any, Any]:
        """
        Fetch data directly from GitHub API (bypassing your Next.js API).
        This replicates the logic from your API route.
        
        Returns:
            Processed JSON data with 'dokploy' replaced by 'Hawiyat'
        """
        now = time.time()
        
        # Check if we have valid cached data
        if self.cached_data and (now - self.cache_timestamp) < self.cache_duration:
            print("Using cached data")
            return self.cached_data
        
        try:
            print("Fetching fresh data from GitHub...")
            
            # Fetch from GitHub API
            github_url = "https://api.github.com/repos/Dokploy/templates/contents/meta.json"
            response = requests.get(github_url, timeout=30)
            response.raise_for_status()
            
            content = response.json()
            
            # Decode Base64 content
            decoded = base64.b64decode(content['content']).decode('utf-8')
            meta = json.loads(decoded)
            
            # Replace "dokploy" with "Hawiyat" in the entire data structure
            modified_meta = self._replace_dokploy(meta)
            
            # Update cache
            self.cached_data = modified_meta
            self.cache_timestamp = now
            
            print("Data fetched and cached successfully")
            return modified_meta
            
        except requests.exceptions.RequestException as e:
            # If error occurs but we have cached data, return it
            if self.cached_data:
                print(f"Error occurred ({e}), returning stale cached data")
                return self.cached_data
            else:
                print(f"Error fetching from GitHub and no cached data available: {e}")
                raise
    
    def _replace_dokploy(self, obj: Any) -> Any:
        """
        Recursively replace 'dokploy' with 'Hawiyat' in the data structure.
        
        Args:
            obj: The object to process
            
        Returns:
            The processed object with replacements made
        """
        if isinstance(obj, str):
            return obj.replace('dokploy', 'Hawiyat').replace('Dokploy', 'Hawiyat')
        elif isinstance(obj, list):
            return [self._replace_dokploy(item) for item in obj]
        elif isinstance(obj, dict):
            new_obj = {}
            for key, value in obj.items():
                new_key = key.replace('dokploy', 'Hawiyat').replace('Dokploy', 'Hawiyat')
                new_obj[new_key] = self._replace_dokploy(value)
            return new_obj
        else:
            return obj
    
    def save_to_file(self, data: Dict[Any, Any], filename: str = "api_data.json"):
        """
        Save the fetched data to a JSON file.
        
        Args:
            data: The data to save
            filename: The filename to save to
        """
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Data saved to {filename}")
        except Exception as e:
            print(f"Error saving to file: {e}")
    
    def get_cache_info(self) -> Dict[str, Any]:
        """
        Get information about the current cache status.
        
        Returns:
            Dictionary with cache information
        """
        if not self.cached_data:
            return {"status": "empty", "age": None, "expires": None}
        
        age = time.time() - self.cache_timestamp
        expires_in = self.cache_duration - age
        
        return {
            "status": "valid" if expires_in > 0 else "stale",
            "age_seconds": int(age),
            "expires_in_seconds": int(max(0, expires_in)),
            "cached_at": datetime.fromtimestamp(self.cache_timestamp).isoformat(),
            "expires_at": datetime.fromtimestamp(self.cache_timestamp + self.cache_duration).isoformat()
        }


def main():
    """Main function to demonstrate usage."""
    
    # Initialize the fetcher
    fetcher = APIDataFetcher()
    
    # Option 1: Fetch directly from GitHub (recommended for standalone use)
    print("=== Fetching directly from GitHub ===")
    try:
        data = fetcher.fetch_directly_from_github()
        print(f"Successfully fetched {len(data)} items")
        
        # Display cache info
        cache_info = fetcher.get_cache_info()
        print(f"Cache Status: {cache_info}")
        
        # Save to file
        fetcher.save_to_file(data, "hawiyat_templates.json")
        
        # Display first few items as preview
        if isinstance(data, list) and data:
            print("\n=== Preview of first item ===")
            print(json.dumps(data[0], indent=2)[:500] + "...")
        elif isinstance(data, dict):
            print("\n=== Preview of data ===")
            preview = dict(list(data.items())[:3])
            print(json.dumps(preview, indent=2))
            
    except Exception as e:
        print(f"Failed to fetch data: {e}")
    
    # Option 2: Fetch from your Next.js API (if you have the base URL)
    # Uncomment and modify the following lines to use your API endpoint:
    
    # print("\n=== Fetching from Next.js API ===")
    # fetcher_api = APIDataFetcher(base_url="http://localhost:3000")  # Replace with your URL
    # try:
    #     api_data = fetcher_api.fetch_from_nextjs_api()
    #     print(f"Successfully fetched from API: {len(api_data)} items")
    #     fetcher_api.save_to_file(api_data, "api_response.json")
    # except Exception as e:
    #     print(f"Failed to fetch from API: {e}")


if __name__ == "__main__":
    main()