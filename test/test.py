# Example usage
from DB import Database
import uuid

# Initialize database
db = Database()

# Create a new user 
username = input("Enter username: ")
email = input("Enter email: ")
password = input("Enter password: ")

# Generate a unique user ID
user_id = str(uuid.uuid4())
print(f"User created with ID: {user_id}")

# Create a new user with the generated user ID
db.create_user(user_id, username, email, password)

# Send a message
message_content = input("Enter your message: ")
message_id = db.send_message(sender_id=1, receiver_id=2, content=message_content)

# Update user settings
settings = {
    "notification_enabled": True,
    "theme_preference": "dark",
    "language_preference": "en"
}
db.update_user_settings(user_id=1, settings_dict=settings)

# Add attachment
attachment_id = db.add_attachment(
    message_id=1,
    file_path="/uploads/image.jpg",
    file_type="image/jpeg",
    file_size=1024
)

# Print all tables in the database
tables = db.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables in the database:")
for table in tables:
    print(table[0])

# Don't forget to close the connection when done
db.close_connection()