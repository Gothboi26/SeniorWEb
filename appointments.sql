CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending Approval',
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
