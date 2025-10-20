# Tom Riddle's Diary

## 🧙‍♂️📖 Welcome to the digital resurrection of the most notorious dark wizard's diary!

![Evil Laugh](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2M2ZnFzYW9jbDdxa29mdnB4bmM4a25uNXc1Zmg4aGozenZjOHBqdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o72FfM5HJydzafgUE/giphy.gif)

Ever wondered what it would be like to have a chat with young Tom Riddle?  
Well, wonder no more!  
This repository houses an interactive diary that lets you converse with a preserved piece of Voldemort's soul.   
Scary? Maybe.  
Cool? Definitely!

## Features:
- **Talk to Tom:** Type your deepest secrets (or just say hi) and receive eerie responses from the Dark Lord in training.
- **Memory Retention:** Like a true Horcrux, the diary remembers your past interactions.
- **Magical Interface:** Open the diary with a click and get lost in its cursed pages.

## Getting Started
### Run the Diary Locally
1. Open a terminal in the project and step into the frontend:  
   ```bash
   cd frontend
   ```
2. Launch a lightweight static server (pick any of these):
   ```bash
   npx serve .
   # or
   python3 -m http.server 3000
   # or
   npx http-server .
   ```
3. Visit the printed `http://localhost` address to watch the cursed book open and start chatting.

> Tip: Browsers may require a click before playing the creaking-book and whisper audio. Tap anywhere on the page if you don’t hear them immediately.

### Use Your Own Cover Art
1. Drop your image file inside `frontend/assets/` (for example `frontend/assets/diary-cover.png`).
2. Keep the file name `diary-cover.png` (or change both the file name and the path inside `frontend/style.css` under `.book-cover { background: ... }`).
3. Restart your local server or refresh the page—your custom cover will appear on the intro book.

## Contributions:
Have ideas to make this diary even more enchanting?  
Pull requests and suggestions are always welcome.  
Just be careful not to awaken any hidden curses!
