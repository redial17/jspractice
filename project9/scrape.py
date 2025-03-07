from bs4 import BeautifulSoup
import os

# Dictionary to store the results
leaf_pages = {}

def is_leaf_page(soup):
    """Check if the page is a leaf node (no 'container' element)."""
    return not soup.find(class_='container')

for file in os.listdir('cattax'):
    if file.endswith('.html'):  # Ensure only HTML files are processed
        with open(os.path.join('cattax', file), 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')

            if is_leaf_page(soup):  # Only process leaf nodes
                title = soup.title.text.strip() if soup.title else "No Title"
                info_box = soup.find(class_='info')
                info_content = info_box.text.strip() if info_box else "No Info"
                
                # Store in dictionary
                leaf_pages[title] = info_content

# Now drop into an interactive session
if __name__ == "__main__":
    import code
    code.interact(local=locals())

