import requests
import time

def capture_snapshot(url):
    wayback_url = f"http://web.archive.org/save/{url}"
    response = requests.get(wayback_url)
    if response.status_code == 200:
        return response.url
    else:
        return None

def main():
    urls = [
        "https://example.com/contracts-en.html",
        "https://example.com/contracts-fr.html"
    ]

    with open("wayback_urls.txt", "w") as file:
        file.write("# URLs of captured snapshots from the Internet Archive's Wayback Machine\n\n")
        for url in urls:
            snapshot_url = capture_snapshot(url)
            if snapshot_url:
                file.write(f"{snapshot_url}\n")
            time.sleep(5)  # To avoid hitting rate limits

if __name__ == "__main__":
    main()
