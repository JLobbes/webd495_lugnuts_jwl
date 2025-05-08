
Description: 

    Respository for WEBD 495 capstone project. The web application, Lugnuts, is an online catalog for an Auto Parts company.

Entity Relationship Diagram:

![ERD for the Lugnuts DB](/images/lugnuts_ERD.png)

```
@startuml

    skinparam tabSize 10
    !define not_null(x) <u>x</u>
    !define primary_key(x) <b>PK\t not_null(x)</b>
    !define foreign_key(x) <b>FK\t x</b>
    !define foreign_and_primary_key(x) <b>PK, FK\t not_null(x)</b>
    !define attribute(x) \t x

    ' Define entities
    entity USERS {
    primary_key(USER_ID)
    ---- 
    attribute(FIREBASE_UID)
    attribute(USER_EMAIL)
    attribute(USER_FIRST_NAME)
    attribute(USER_LAST_NAME)
    attribute(USER_ADDRESS)
    attribute(USER_PHONE_NUMBER)
    attribute(USER_ROLE)
    }

    entity PRODUCTS {
    primary_key(PRODUCT_ID)
    ----
    attribute(PRODUCT_NAME)
    attribute(PRODUCT_DESCRIPTION)
    attribute(PRODUCT_PRICE)
    attribute(PRODUCT_STOCK)
    attribute(PRODUCT_CATEGORY)
    attribute(PRODUCT_IMAGE_URL)
    }


    entity ORDERS {
    primary_key(ORDER_ID)
    ----
    foreign_key(USER_ID)
    attribute(ORDER_DATE)
    attribute(ORDER_TOTAL_AMOUNT)
    attribute(ORDER_STATUS)
    attribute(ORDER_SHIPPING_ADDRESS)
    }

    entity ORDERITEMS {
    primary_key(ORDER_ITEM_ID)
    ----
    foreign_key(ORDER_ID)
    foreign_key(PRODUCT_ID)
    attribute(ORDER_ITEM_QUANTITY)
    attribute(ORDER_ITEM_PRICE)
    }

    entity CART {
    primary_key(CART_ID)
    ----
    foreign_key(USER_ID)
    }

    entity CARTITEMS {
    primary_key(CART_ITEM_ID)
    ----
    foreign_key(CART_ID)
    foreign_key(PRODUCT_ID)
    attribute(CART_ITEM_QUANTITY)
    attribute(CART_ITEM_ADDED_AT)
    }

    entity TRANSACTIONS {
    primary_key(TRANSACTION_ID)
    ----
    foreign_key(ORDER_ID)
    attribute(TRANSACTION_PAYMENT_STATUS)
    attribute(TRANSACTION_PAYMENT_METHOD)
    attribute(TRANSACTION_PAYMENT_DATE)
    }


    ' Define relationships
    USERS ||--o{ ORDERS : " places "
    ORDERS ||--o{ ORDERITEMS : " contains "
    PRODUCTS ||--o{ ORDERITEMS : " appears in "
    USERS ||--|| CART : " has "
    CART ||--o{ CARTITEMS : " contains "
    PRODUCTS ||--o{ CARTITEMS : " appears in "
    ORDERS ||--|| TRANSACTIONS : " is associated with "
    ' Relationships

@enduml
 
```

``` 

-- Users table to store user account details
CREATE TABLE USERS (
    USER_ID INT AUTO_INCREMENT PRIMARY KEY,
    FIREBASE_UID VARCHAR(255) NOT NULL UNIQUE,
    USER_EMAIL VARCHAR(255) NOT NULL UNIQUE,
    USER_FIRST_NAME VARCHAR(255),
    USER_LAST_NAME VARCHAR(255),
    USER_ADDRESS VARCHAR(255),
    USER_PHONE_NUMBER VARCHAR(20),
    USER_ROLE ENUM('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user'
);

-- Products table to store information about products
CREATE TABLE PRODUCTS (
    PRODUCT_ID INT AUTO_INCREMENT PRIMARY KEY,
    PRODUCT_NAME VARCHAR(255) NOT NULL,
    PRODUCT_DESCRIPTION TEXT,
    PRODUCT_PRICE DECIMAL(10, 2) NOT NULL,
    PRODUCT_STOCK INT NOT NULL DEFAULT 0,
    PRODUCT_CATEGORY VARCHAR(100),
    PRODUCT_IMAGE_URL VARCHAR(255)
);

-- Orders table to store order details
CREATE TABLE ORDERS (
    ORDER_ID INT AUTO_INCREMENT PRIMARY KEY,
    USER_ID INT NOT NULL,
    ORDER_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ORDER_TOTAL_AMOUNT DECIMAL(10, 2) NOT NULL,
    ORDER_STATUS ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
    ORDER_SHIPPING_ADDRESS VARCHAR(255),
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE
);

-- OrderItems table to store products within an order
CREATE TABLE ORDERITEMS (
    ORDER_ITEM_ID INT AUTO_INCREMENT PRIMARY KEY,
    ORDER_ID INT NOT NULL,
    PRODUCT_ID INT NOT NULL,
    ORDER_ITEM_QUANTITY INT NOT NULL,
    ORDER_ITEM_PRICE DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID) ON DELETE CASCADE,
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);

-- Shopping Cart table to store products in a user's cart
CREATE TABLE CART (
    CART_ID INT AUTO_INCREMENT PRIMARY KEY,
    USER_ID INT NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE
);

-- CartItems table to store products in the shopping cart
CREATE TABLE CARTITEMS (
    CART_ITEM_ID INT AUTO_INCREMENT PRIMARY KEY,
    CART_ID INT NOT NULL,
    PRODUCT_ID INT NOT NULL,
    CART_ITEM_QUANTITY INT NOT NULL,
    CART_ITEM_ADDED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CART_ID) REFERENCES CART(CART_ID) ON DELETE CASCADE,
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);

-- Payment Transactions table to store payment details
CREATE TABLE TRANSACTIONS (
    TRANSACTION_ID INT AUTO_INCREMENT PRIMARY KEY,
    ORDER_ID INT NOT NULL,
    TRANSACTION_PAYMENT_STATUS ENUM('pending', 'successful', 'failed') DEFAULT 'pending',
    TRANSACTION_PAYMENT_METHOD ENUM('bill_me', 'stripe', 'other') NOT NULL,
    TRANSACTION_PAYMENT_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID) ON DELETE CASCADE
);

``` 