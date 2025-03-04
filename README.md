
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

    entity ADMINS {
    primary_key(ADMIN_ID)
    ----
    attribute(ADMIN_EMAIL)
    attribute(ADMIN_PASSWORD_HASH)
    attribute(ADMIN_FULL_NAME)
    }

    note right of ADMINS
    Islolated Admin updates order
            + transaction status 
            and edits products.
    end note

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