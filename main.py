from diary import TomRiddleDiary

def main():
    diary = TomRiddleDiary()
    print("Welcome to Tom Riddle's Diary! (Type 'exit' to quit)")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("Goodbye!")
            break
        
        diary.add_entry(user_input)
        response = diary.generate_response(user_input)
        print(f"Tom Riddle: {response}")

if __name__ == "__main__":
    main()
