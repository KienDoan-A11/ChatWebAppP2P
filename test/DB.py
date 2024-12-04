# database.py
import sqlite3
from sqlite3 import Error
import os
from datetime import datetime

class Database:
    def __init__(self, db_file="chat_database.db"):
        self.db_file = db_file
        self.conn = None
        self.create_connection()
        self.create_tables()

    def create_connection(self):
        """Create a database connection to SQLite"""
        try:
            self.conn = sqlite3.connect(self.db_file, check_same_thread=False)
            self.conn.row_factory = sqlite3.Row  # This enables column access by name
            print("SQLite connection established")
        except Error as e:
            print(f"Error connecting to database: {e}")

    def create_tables(self):
        """Create necessary tables if they don't exist"""
        try:
            cursor = self.conn.cursor()
            
            # Users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userID TEXT UNIQUE NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1,
                    profile_picture TEXT,
                    bio TEXT
                )
            ''')

            # Messages table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sender_id INTEGER NOT NULL,
                    receiver_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_read BOOLEAN DEFAULT 0,
                    message_type TEXT DEFAULT 'text',
                    FOREIGN KEY (sender_id) REFERENCES users (id),
                    FOREIGN KEY (receiver_id) REFERENCES users (id)
                )
            ''')

            # Conversations table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user1_id INTEGER NOT NULL,
                    user2_id INTEGER NOT NULL,
                    last_message_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user1_id) REFERENCES users (id),
                    FOREIGN KEY (user2_id) REFERENCES users (id),
                    FOREIGN KEY (last_message_id) REFERENCES messages (id)
                )
            ''')

            # User Settings table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_settings (
                    user_id INTEGER PRIMARY KEY,
                    notification_enabled BOOLEAN DEFAULT 1,
                    theme_preference TEXT DEFAULT 'light',
                    language_preference TEXT DEFAULT 'en',
                    privacy_level TEXT DEFAULT 'public',
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            ''')

            # Attachments table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS attachments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    message_id INTEGER NOT NULL,
                    file_path TEXT NOT NULL,
                    file_type TEXT NOT NULL,
                    file_size INTEGER NOT NULL,
                    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (message_id) REFERENCES messages (id)
                )
            ''')

            self.conn.commit()
            print("Tables created successfully")
        except Error as e:
            print(f"Error creating tables: {e}")

    # User operations
    def create_user(self, userID, username, email, password_hash):
        sql = '''INSERT INTO users (userID, username, email, password_hash)
                 VALUES (?, ?, ?, ?)'''
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql, (userID, username, email, password_hash))
            self.conn.commit()
            return cursor.lastrowid
        except Error as e:
            print(f"Error creating user: {e}")
            return None

    def get_user_by_username(self, username):
        sql = '''SELECT * FROM users WHERE username = ?'''
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql, (username,))
            return cursor.fetchone()
        except Error as e:
            print(f"Error fetching user: {e}")
            return None

    # Message operations
    def send_message(self, sender_id, receiver_id, content, message_type='text'):
        sql = '''INSERT INTO messages (sender_id, receiver_id, content, message_type)
                 VALUES (?, ?, ?, ?)'''
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql, (sender_id, receiver_id, content, message_type))
            message_id = cursor.lastrowid

            # Update or create conversation
            self.update_conversation(sender_id, receiver_id, message_id)
            
            self.conn.commit()
            return message_id
        except Error as e:
            print(f"Error sending message: {e}")
            return None

    def get_messages(self, user1_id, user2_id, limit=50):
        sql = '''SELECT * FROM messages 
                 WHERE (sender_id = ? AND receiver_id = ?)
                 OR (sender_id = ? AND receiver_id = ?)
                 ORDER BY timestamp DESC
                 LIMIT ?'''
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql, (user1_id, user2_id, user2_id, user1_id, limit))
            return cursor.fetchall()
        except Error as e:
            print(f"Error fetching messages: {e}")
            return []

    # Conversation operations
    def update_conversation(self, user1_id, user2_id, last_message_id):
        sql = '''INSERT INTO conversations (user1_id, user2_id, last_message_id)
                 VALUES (?, ?, ?)
                 ON CONFLICT (id) DO UPDATE SET
                 last_message_id = ?,
                 updated_at = CURRENT_TIMESTAMP'''
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql, (user1_id, user2_id, last_message_id, last_message_id))
            self.conn.commit()
        except Error as e:
            print(f"Error updating conversation: {e}")

    def get_user_conversations(self, user_id):
        sql = '''SELECT c.*, u.username, m.content as last_message
                 FROM conversations c
                 JOIN users u ON (c.user1_id = u.id OR c.user2_id = u.id)
                 LEFT JOIN messages m ON c.last_message_id = m.id
                 WHERE (c.user1_id = ? OR c.user2_id = ?)
                 AND u.id != ?
                 ORDER BY c.updated_at DESC'''
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql, (user_id, user_id, user_id))
            return cursor.fetchall()
        except Error as e:
            print(f"Error fetching conversations: {e}")
            return []

    # User settings operations
    def update_user_settings(self, user_id, settings_dict):
        placeholders = ', '.join([f'{k} = ?' for k in settings_dict.keys()])
        sql = f'''INSERT INTO user_settings (user_id, {', '.join(settings_dict.keys())})
                  VALUES (?, {', '.join(['?'] * len(settings_dict))})
                  ON CONFLICT (user_id) DO UPDATE SET {placeholders}'''
        try:
            cursor = self.conn.cursor()
            values = (user_id,) + tuple(settings_dict.values())
            update_values = tuple(settings_dict.values())
            cursor.execute(sql, values + update_values)
            self.conn.commit()
            return True
        except Error as e:
            print(f"Error updating settings: {e}")
            return False

    # Attachment operations
    def add_attachment(self, message_id, file_path, file_type, file_size):
        sql = '''INSERT INTO attachments (message_id, file_path, file_type, file_size)
                 VALUES (?, ?, ?, ?)'''
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql, (message_id, file_path, file_type, file_size))
            self.conn.commit()
            return cursor.lastrowid
        except Error as e:
            print(f"Error adding attachment: {e}")
            return None

    def execute(self, query, params=()):
        try:
            cursor = self.conn.cursor()
            cursor.execute(query, params)
            return cursor.fetchall()
        except Error as e:
            print(f"Error executing query: {e}")
            return []

    def close_connection(self):
        """Close the database connection"""
        if self.conn:
            self.conn.close()
            print("Database connection closed")