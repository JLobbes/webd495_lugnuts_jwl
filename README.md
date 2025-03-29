
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
```
webd495_lugnuts_jwl
├─ BUGLIST.md
├─ LICENSE
├─ README.md
├─ images
│  └─ lugnuts_ERD.png
└─ project
   ├─ .next
   │  ├─ app-build-manifest.json
   │  ├─ build-manifest.json
   │  ├─ cache
   │  │  └─ .rscinfo
   │  ├─ fallback-build-manifest.json
   │  ├─ package.json
   │  ├─ server
   │  │  ├─ app
   │  │  │  ├─ _not-found
   │  │  │  │  ├─ page
   │  │  │  │  │  ├─ app-build-manifest.json
   │  │  │  │  │  ├─ app-paths-manifest.json
   │  │  │  │  │  ├─ build-manifest.json
   │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  ├─ react-loadable-manifest.json
   │  │  │  │  │  └─ server-reference-manifest.json
   │  │  │  │  ├─ page.js
   │  │  │  │  ├─ page.js.map
   │  │  │  │  └─ page_client-reference-manifest.js
   │  │  │  ├─ favicon.ico
   │  │  │  │  ├─ route
   │  │  │  │  │  ├─ app-build-manifest.json
   │  │  │  │  │  ├─ app-paths-manifest.json
   │  │  │  │  │  ├─ build-manifest.json
   │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  ├─ react-loadable-manifest.json
   │  │  │  │  │  └─ server-reference-manifest.json
   │  │  │  │  ├─ route.js
   │  │  │  │  ├─ route.js.map
   │  │  │  │  └─ route_client-reference-manifest.js
   │  │  │  ├─ page
   │  │  │  │  ├─ app-build-manifest.json
   │  │  │  │  ├─ app-paths-manifest.json
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ react-loadable-manifest.json
   │  │  │  │  └─ server-reference-manifest.json
   │  │  │  ├─ page.js
   │  │  │  ├─ page.js.map
   │  │  │  └─ page_client-reference-manifest.js
   │  │  ├─ app-paths-manifest.json
   │  │  ├─ chunks
   │  │  │  ├─ [root of the server]__1562d94a._.js
   │  │  │  ├─ [root of the server]__1562d94a._.js.map
   │  │  │  ├─ [root of the server]__17f8f792._.js
   │  │  │  ├─ [root of the server]__17f8f792._.js.map
   │  │  │  ├─ [root of the server]__1d9d2f10._.js
   │  │  │  ├─ [root of the server]__1d9d2f10._.js.map
   │  │  │  ├─ [root of the server]__250c03f3._.js
   │  │  │  ├─ [root of the server]__250c03f3._.js.map
   │  │  │  ├─ [root of the server]__29c3939f._.js
   │  │  │  ├─ [root of the server]__29c3939f._.js.map
   │  │  │  ├─ [root of the server]__3a197fa0._.js
   │  │  │  ├─ [root of the server]__3a197fa0._.js.map
   │  │  │  ├─ [root of the server]__41aee865._.js
   │  │  │  ├─ [root of the server]__41aee865._.js.map
   │  │  │  ├─ [root of the server]__63a81854._.js
   │  │  │  ├─ [root of the server]__63a81854._.js.map
   │  │  │  ├─ [root of the server]__63ecc984._.js
   │  │  │  ├─ [root of the server]__63ecc984._.js.map
   │  │  │  ├─ [root of the server]__8a700820._.js
   │  │  │  ├─ [root of the server]__8a700820._.js.map
   │  │  │  ├─ [root of the server]__98fba829._.js
   │  │  │  ├─ [root of the server]__98fba829._.js.map
   │  │  │  ├─ [root of the server]__a27a0fc7._.js
   │  │  │  ├─ [root of the server]__a27a0fc7._.js.map
   │  │  │  ├─ [root of the server]__af55d51e._.js
   │  │  │  ├─ [root of the server]__af55d51e._.js.map
   │  │  │  ├─ [root of the server]__ddb12edd._.js
   │  │  │  ├─ [root of the server]__ddb12edd._.js.map
   │  │  │  ├─ [root of the server]__e407bd84._.js
   │  │  │  ├─ [root of the server]__e407bd84._.js.map
   │  │  │  ├─ [root of the server]__ed133d7c._.js
   │  │  │  ├─ [root of the server]__ed133d7c._.js.map
   │  │  │  ├─ [root of the server]__f8f3a4a7._.js
   │  │  │  ├─ [root of the server]__f8f3a4a7._.js.map
   │  │  │  ├─ [turbopack]_runtime.js
   │  │  │  ├─ [turbopack]_runtime.js.map
   │  │  │  └─ ssr
   │  │  │     ├─ [externals]_next_dist_compiled_next-server_app-page_runtime_dev_53c4c985.js
   │  │  │     ├─ [externals]_next_dist_compiled_next-server_app-page_runtime_dev_53c4c985.js.map
   │  │  │     ├─ [root of the server]__06d540ef._.js
   │  │  │     ├─ [root of the server]__06d540ef._.js.map
   │  │  │     ├─ [root of the server]__1224a124._.js
   │  │  │     ├─ [root of the server]__1224a124._.js.map
   │  │  │     ├─ [root of the server]__12ee8ac2._.js
   │  │  │     ├─ [root of the server]__12ee8ac2._.js.map
   │  │  │     ├─ [root of the server]__18195e5f._.js
   │  │  │     ├─ [root of the server]__18195e5f._.js.map
   │  │  │     ├─ [root of the server]__2044d9b6._.js
   │  │  │     ├─ [root of the server]__2044d9b6._.js.map
   │  │  │     ├─ [root of the server]__207a66e3._.js
   │  │  │     ├─ [root of the server]__207a66e3._.js.map
   │  │  │     ├─ [root of the server]__2095d362._.js
   │  │  │     ├─ [root of the server]__2095d362._.js.map
   │  │  │     ├─ [root of the server]__251a95ef._.js
   │  │  │     ├─ [root of the server]__251a95ef._.js.map
   │  │  │     ├─ [root of the server]__29912de3._.js
   │  │  │     ├─ [root of the server]__29912de3._.js.map
   │  │  │     ├─ [root of the server]__2f477317._.js
   │  │  │     ├─ [root of the server]__2f477317._.js.map
   │  │  │     ├─ [root of the server]__30538643._.js
   │  │  │     ├─ [root of the server]__30538643._.js.map
   │  │  │     ├─ [root of the server]__3c991399._.js
   │  │  │     ├─ [root of the server]__3c991399._.js.map
   │  │  │     ├─ [root of the server]__40d0249f._.js
   │  │  │     ├─ [root of the server]__40d0249f._.js.map
   │  │  │     ├─ [root of the server]__47f70416._.js
   │  │  │     ├─ [root of the server]__47f70416._.js.map
   │  │  │     ├─ [root of the server]__4957f684._.js
   │  │  │     ├─ [root of the server]__4957f684._.js.map
   │  │  │     ├─ [root of the server]__4aa90384._.js
   │  │  │     ├─ [root of the server]__4aa90384._.js.map
   │  │  │     ├─ [root of the server]__5f09becd._.js
   │  │  │     ├─ [root of the server]__5f09becd._.js.map
   │  │  │     ├─ [root of the server]__6655c217._.js
   │  │  │     ├─ [root of the server]__6655c217._.js.map
   │  │  │     ├─ [root of the server]__67c09f69._.js
   │  │  │     ├─ [root of the server]__67c09f69._.js.map
   │  │  │     ├─ [root of the server]__688d87de._.js
   │  │  │     ├─ [root of the server]__688d87de._.js.map
   │  │  │     ├─ [root of the server]__69858490._.js
   │  │  │     ├─ [root of the server]__69858490._.js.map
   │  │  │     ├─ [root of the server]__6aa3dda0._.js
   │  │  │     ├─ [root of the server]__6aa3dda0._.js.map
   │  │  │     ├─ [root of the server]__6b5d57d3._.js
   │  │  │     ├─ [root of the server]__6b5d57d3._.js.map
   │  │  │     ├─ [root of the server]__6d7f9fcf._.js
   │  │  │     ├─ [root of the server]__6d7f9fcf._.js.map
   │  │  │     ├─ [root of the server]__7bd493d7._.js
   │  │  │     ├─ [root of the server]__7bd493d7._.js.map
   │  │  │     ├─ [root of the server]__821d741a._.js
   │  │  │     ├─ [root of the server]__821d741a._.js.map
   │  │  │     ├─ [root of the server]__86e7898f._.js
   │  │  │     ├─ [root of the server]__86e7898f._.js.map
   │  │  │     ├─ [root of the server]__87988bb9._.js
   │  │  │     ├─ [root of the server]__87988bb9._.js.map
   │  │  │     ├─ [root of the server]__893c2ea5._.js
   │  │  │     ├─ [root of the server]__893c2ea5._.js.map
   │  │  │     ├─ [root of the server]__89460b31._.js
   │  │  │     ├─ [root of the server]__89460b31._.js.map
   │  │  │     ├─ [root of the server]__8be40ae9._.js
   │  │  │     ├─ [root of the server]__8be40ae9._.js.map
   │  │  │     ├─ [root of the server]__93e1bb5f._.js
   │  │  │     ├─ [root of the server]__93e1bb5f._.js.map
   │  │  │     ├─ [root of the server]__94d9ff73._.js
   │  │  │     ├─ [root of the server]__94d9ff73._.js.map
   │  │  │     ├─ [root of the server]__961211a8._.js
   │  │  │     ├─ [root of the server]__961211a8._.js.map
   │  │  │     ├─ [root of the server]__97856352._.js
   │  │  │     ├─ [root of the server]__97856352._.js.map
   │  │  │     ├─ [root of the server]__97e0e1e6._.js
   │  │  │     ├─ [root of the server]__97e0e1e6._.js.map
   │  │  │     ├─ [root of the server]__a26d98c4._.js
   │  │  │     ├─ [root of the server]__a26d98c4._.js.map
   │  │  │     ├─ [root of the server]__b1e6d721._.js
   │  │  │     ├─ [root of the server]__b1e6d721._.js.map
   │  │  │     ├─ [root of the server]__b7df9cde._.js
   │  │  │     ├─ [root of the server]__b7df9cde._.js.map
   │  │  │     ├─ [root of the server]__c870132d._.js
   │  │  │     ├─ [root of the server]__c870132d._.js.map
   │  │  │     ├─ [root of the server]__c9e7705d._.js
   │  │  │     ├─ [root of the server]__c9e7705d._.js.map
   │  │  │     ├─ [root of the server]__cadf04b5._.js
   │  │  │     ├─ [root of the server]__cadf04b5._.js.map
   │  │  │     ├─ [root of the server]__cb113705._.js
   │  │  │     ├─ [root of the server]__cb113705._.js.map
   │  │  │     ├─ [root of the server]__cc7cd800._.js
   │  │  │     ├─ [root of the server]__cc7cd800._.js.map
   │  │  │     ├─ [root of the server]__d2ee0464._.js
   │  │  │     ├─ [root of the server]__d2ee0464._.js.map
   │  │  │     ├─ [root of the server]__d8724e72._.js
   │  │  │     ├─ [root of the server]__d8724e72._.js.map
   │  │  │     ├─ [root of the server]__df3518de._.js
   │  │  │     ├─ [root of the server]__df3518de._.js.map
   │  │  │     ├─ [root of the server]__e237d7a2._.js
   │  │  │     ├─ [root of the server]__e237d7a2._.js.map
   │  │  │     ├─ [turbopack]_runtime.js
   │  │  │     ├─ [turbopack]_runtime.js.map
   │  │  │     ├─ _5fc2af0d._.js
   │  │  │     ├─ _5fc2af0d._.js.map
   │  │  │     ├─ _86113e8e._.js
   │  │  │     ├─ _86113e8e._.js.map
   │  │  │     ├─ app_1f3630ef._.js
   │  │  │     ├─ app_1f3630ef._.js.map
   │  │  │     ├─ pages__app_9120ef7d.js
   │  │  │     ├─ pages__app_9120ef7d.js.map
   │  │  │     ├─ pages__document_970ba9b0.js
   │  │  │     └─ pages__document_970ba9b0.js.map
   │  │  ├─ interception-route-rewrite-manifest.js
   │  │  ├─ middleware-build-manifest.js
   │  │  ├─ middleware-manifest.json
   │  │  ├─ next-font-manifest.js
   │  │  ├─ next-font-manifest.json
   │  │  ├─ pages
   │  │  │  ├─ _app
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ _app.js
   │  │  │  ├─ _app.js.map
   │  │  │  ├─ _document
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ _document.js
   │  │  │  ├─ _document.js.map
   │  │  │  ├─ _error
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ _error.js
   │  │  │  ├─ _error.js.map
   │  │  │  ├─ api
   │  │  │  │  ├─ cart
   │  │  │  │  │  ├─ add
   │  │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  │  ├─ add.js
   │  │  │  │  │  ├─ add.js.map
   │  │  │  │  │  ├─ read_by_firebase_uid
   │  │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  │  ├─ read_by_firebase_uid.js
   │  │  │  │  │  ├─ read_by_firebase_uid.js.map
   │  │  │  │  │  ├─ remove
   │  │  │  │  │  │  ├─ build-manifest.json
   │  │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  │  ├─ remove.js
   │  │  │  │  │  └─ remove.js.map
   │  │  │  │  ├─ products
   │  │  │  │  │  ├─ read_all
   │  │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  │  ├─ read_all.js
   │  │  │  │  │  ├─ read_all.js.map
   │  │  │  │  │  ├─ read_by_id
   │  │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  │  ├─ read_by_id.js
   │  │  │  │  │  ├─ read_by_id.js.map
   │  │  │  │  │  ├─ search
   │  │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  │  ├─ search.js
   │  │  │  │  │  ├─ search.js.map
   │  │  │  │  │  ├─ update
   │  │  │  │  │  │  ├─ build-manifest.json
   │  │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  │  ├─ update.js
   │  │  │  │  │  └─ update.js.map
   │  │  │  │  ├─ test_DB_connect
   │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  ├─ test_DB_connect.js
   │  │  │  │  ├─ test_DB_connect.js.map
   │  │  │  │  └─ users
   │  │  │  │     ├─ create
   │  │  │  │     │  ├─ next-font-manifest.json
   │  │  │  │     │  ├─ pages-manifest.json
   │  │  │  │     │  └─ react-loadable-manifest.json
   │  │  │  │     ├─ create.js
   │  │  │  │     ├─ create.js.map
   │  │  │  │     ├─ read_all
   │  │  │  │     │  ├─ next-font-manifest.json
   │  │  │  │     │  ├─ pages-manifest.json
   │  │  │  │     │  └─ react-loadable-manifest.json
   │  │  │  │     ├─ read_all.js
   │  │  │  │     ├─ read_all.js.map
   │  │  │  │     ├─ read_by_firebase_uid
   │  │  │  │     │  ├─ next-font-manifest.json
   │  │  │  │     │  ├─ pages-manifest.json
   │  │  │  │     │  └─ react-loadable-manifest.json
   │  │  │  │     ├─ read_by_firebase_uid.js
   │  │  │  │     ├─ read_by_firebase_uid.js.map
   │  │  │  │     ├─ read_by_id
   │  │  │  │     │  ├─ next-font-manifest.json
   │  │  │  │     │  ├─ pages-manifest.json
   │  │  │  │     │  └─ react-loadable-manifest.json
   │  │  │  │     ├─ read_by_id.js
   │  │  │  │     ├─ read_by_id.js.map
   │  │  │  │     ├─ update
   │  │  │  │     │  ├─ next-font-manifest.json
   │  │  │  │     │  ├─ pages-manifest.json
   │  │  │  │     │  └─ react-loadable-manifest.json
   │  │  │  │     ├─ update.js
   │  │  │  │     ├─ update.js.map
   │  │  │  │     ├─ update_by_firebase_uid
   │  │  │  │     │  ├─ next-font-manifest.json
   │  │  │  │     │  ├─ pages-manifest.json
   │  │  │  │     │  └─ react-loadable-manifest.json
   │  │  │  │     ├─ update_by_firebase_uid.js
   │  │  │  │     └─ update_by_firebase_uid.js.map
   │  │  │  ├─ index
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ index.js
   │  │  │  ├─ index.js.map
   │  │  │  ├─ products
   │  │  │  │  ├─ search_ui
   │  │  │  │  │  ├─ build-manifest.json
   │  │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  │  ├─ search_ui.js
   │  │  │  │  └─ search_ui.js.map
   │  │  │  ├─ signin_ui
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ signin_ui.js
   │  │  │  ├─ signin_ui.js.map
   │  │  │  ├─ signup_ui
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ signup_ui.js
   │  │  │  ├─ signup_ui.js.map
   │  │  │  ├─ test_page
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ test_page.js
   │  │  │  ├─ test_page.js.map
   │  │  │  ├─ user_cart
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ user_cart.js
   │  │  │  ├─ user_cart.js.map
   │  │  │  ├─ user_profile
   │  │  │  │  ├─ build-manifest.json
   │  │  │  │  ├─ next-font-manifest.json
   │  │  │  │  ├─ pages-manifest.json
   │  │  │  │  └─ react-loadable-manifest.json
   │  │  │  ├─ user_profile.js
   │  │  │  └─ user_profile.js.map
   │  │  ├─ pages-manifest.json
   │  │  ├─ server-reference-manifest.js
   │  │  └─ server-reference-manifest.json
   │  ├─ static
   │  │  ├─ chunks
   │  │  │  ├─ [next]_internal_font_google_geist_6feb203d_module_b52d8e88.css
   │  │  │  ├─ [next]_internal_font_google_geist_6feb203d_module_b52d8e88.css.map
   │  │  │  ├─ [next]_internal_font_google_geist_mono_c7d183a_module_b52d8e88.css
   │  │  │  ├─ [next]_internal_font_google_geist_mono_c7d183a_module_b52d8e88.css.map
   │  │  │  ├─ [next]_internal_font_google_gyByhwUxId8gMEwSGFWNOITddY4-s_woff2_ba3284f5._.css
   │  │  │  ├─ [next]_internal_font_google_gyByhwUxId8gMEwSGFWNOITddY4-s_woff2_ba3284f5._.css.map
   │  │  │  ├─ [next]_internal_font_google_gyByhwUxId8gMEwcGFWNOITd-s_p_woff2_ba3284f5._.css
   │  │  │  ├─ [next]_internal_font_google_gyByhwUxId8gMEwcGFWNOITd-s_p_woff2_ba3284f5._.css.map
   │  │  │  ├─ [next]_internal_font_google_or3nQ6H_1_WfwkMZI_qYFrcdmhHkjko-s_p_woff2_ba3284f5._.css
   │  │  │  ├─ [next]_internal_font_google_or3nQ6H_1_WfwkMZI_qYFrcdmhHkjko-s_p_woff2_ba3284f5._.css.map
   │  │  │  ├─ [next]_internal_font_google_or3nQ6H_1_WfwkMZI_qYFrkdmhHkjkotbA-s_woff2_ba3284f5._.css
   │  │  │  ├─ [next]_internal_font_google_or3nQ6H_1_WfwkMZI_qYFrkdmhHkjkotbA-s_woff2_ba3284f5._.css.map
   │  │  │  ├─ [root of the server]__10795df3._.js
   │  │  │  ├─ [root of the server]__10795df3._.js.map
   │  │  │  ├─ [root of the server]__10b3341b._.js
   │  │  │  ├─ [root of the server]__10b3341b._.js.map
   │  │  │  ├─ [root of the server]__1a2556b0._.js
   │  │  │  ├─ [root of the server]__1a2556b0._.js.map
   │  │  │  ├─ [root of the server]__1e1d178d._.js
   │  │  │  ├─ [root of the server]__1e1d178d._.js.map
   │  │  │  ├─ [root of the server]__21f38a88._.js
   │  │  │  ├─ [root of the server]__21f38a88._.js.map
   │  │  │  ├─ [root of the server]__2d31522a._.js
   │  │  │  ├─ [root of the server]__2d31522a._.js.map
   │  │  │  ├─ [root of the server]__342d50db._.js
   │  │  │  ├─ [root of the server]__342d50db._.js.map
   │  │  │  ├─ [root of the server]__3759f8a9._.js
   │  │  │  ├─ [root of the server]__3759f8a9._.js.map
   │  │  │  ├─ [root of the server]__38180bf3._.js
   │  │  │  ├─ [root of the server]__38180bf3._.js.map
   │  │  │  ├─ [root of the server]__3db00b2c._.js
   │  │  │  ├─ [root of the server]__3db00b2c._.js.map
   │  │  │  ├─ [root of the server]__40c16e11._.js
   │  │  │  ├─ [root of the server]__40c16e11._.js.map
   │  │  │  ├─ [root of the server]__4697773f._.js
   │  │  │  ├─ [root of the server]__4697773f._.js.map
   │  │  │  ├─ [root of the server]__4845ca39._.js
   │  │  │  ├─ [root of the server]__4845ca39._.js.map
   │  │  │  ├─ [root of the server]__49fd8634._.js
   │  │  │  ├─ [root of the server]__49fd8634._.js.map
   │  │  │  ├─ [root of the server]__5ada3e22._.js
   │  │  │  ├─ [root of the server]__5ada3e22._.js.map
   │  │  │  ├─ [root of the server]__63416926._.js
   │  │  │  ├─ [root of the server]__63416926._.js.map
   │  │  │  ├─ [root of the server]__6d3a8ffb._.js
   │  │  │  ├─ [root of the server]__6d3a8ffb._.js.map
   │  │  │  ├─ [root of the server]__76cbfde6._.js
   │  │  │  ├─ [root of the server]__76cbfde6._.js.map
   │  │  │  ├─ [root of the server]__798b663b._.js
   │  │  │  ├─ [root of the server]__798b663b._.js.map
   │  │  │  ├─ [root of the server]__7c95b69e._.js
   │  │  │  ├─ [root of the server]__7c95b69e._.js.map
   │  │  │  ├─ [root of the server]__923cb372._.js
   │  │  │  ├─ [root of the server]__923cb372._.js.map
   │  │  │  ├─ [root of the server]__94c2e21b._.js
   │  │  │  ├─ [root of the server]__94c2e21b._.js.map
   │  │  │  ├─ [root of the server]__9edf89a4._.js
   │  │  │  ├─ [root of the server]__9edf89a4._.js.map
   │  │  │  ├─ [root of the server]__a6f7b132._.css
   │  │  │  ├─ [root of the server]__a6f7b132._.css.map
   │  │  │  ├─ [root of the server]__aa938098._.js
   │  │  │  ├─ [root of the server]__aa938098._.js.map
   │  │  │  ├─ [root of the server]__afdbc793._.js
   │  │  │  ├─ [root of the server]__afdbc793._.js.map
   │  │  │  ├─ [root of the server]__ba18ad40._.js
   │  │  │  ├─ [root of the server]__ba18ad40._.js.map
   │  │  │  ├─ [root of the server]__c0067d82._.js
   │  │  │  ├─ [root of the server]__c0067d82._.js.map
   │  │  │  ├─ [root of the server]__c8e4b3a2._.js
   │  │  │  ├─ [root of the server]__c8e4b3a2._.js.map
   │  │  │  ├─ [root of the server]__ca8758f1._.js
   │  │  │  ├─ [root of the server]__ca8758f1._.js.map
   │  │  │  ├─ [root of the server]__d95192cd._.js
   │  │  │  ├─ [root of the server]__d95192cd._.js.map
   │  │  │  ├─ [root of the server]__f0973484._.js
   │  │  │  ├─ [root of the server]__f0973484._.js.map
   │  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_275e8479._.js
   │  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_275e8479._.js.map
   │  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_3f727431._.js
   │  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_61dcf9ba._.js
   │  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_61dcf9ba._.js.map
   │  │  │  ├─ _4dd6d3fc._.css
   │  │  │  ├─ _4dd6d3fc._.css.map
   │  │  │  ├─ _99ed78ed._.css
   │  │  │  ├─ _99ed78ed._.css.map
   │  │  │  ├─ _e69f0d32._.js
   │  │  │  ├─ _fc096475._.js
   │  │  │  ├─ _fc096475._.js.map
   │  │  │  ├─ app_favicon_ico_mjs_0c545fd8._.js
   │  │  │  ├─ app_globals_b52d8e88.css
   │  │  │  ├─ app_globals_b52d8e88.css.map
   │  │  │  ├─ app_layout_e936f940.js
   │  │  │  ├─ app_page_5a41f9c9.js
   │  │  │  ├─ app_page_module_24d20b32.css
   │  │  │  ├─ app_page_module_24d20b32.css.map
   │  │  │  ├─ app_page_module_b52d8e88.css
   │  │  │  ├─ app_page_module_b52d8e88.css.map
   │  │  │  ├─ pages
   │  │  │  │  ├─ _app.js
   │  │  │  │  ├─ _error.js
   │  │  │  │  ├─ api
   │  │  │  │  │  ├─ cart
   │  │  │  │  │  │  └─ remove.js
   │  │  │  │  │  └─ products
   │  │  │  │  │     └─ update.js
   │  │  │  │  ├─ index.js
   │  │  │  │  ├─ products
   │  │  │  │  │  └─ search_ui.js
   │  │  │  │  ├─ signin_ui.js
   │  │  │  │  ├─ signup_ui.js
   │  │  │  │  ├─ test_page.js
   │  │  │  │  ├─ user_cart.js
   │  │  │  │  └─ user_profile.js
   │  │  │  ├─ pages__app_2317ca7c._.js
   │  │  │  ├─ pages__app_2317ca7c._.js.map
   │  │  │  ├─ pages__app_540f1797._.js
   │  │  │  ├─ pages__app_540f1797._.js.map
   │  │  │  ├─ pages__app_5771e187._.js
   │  │  │  ├─ pages__app_6766edb5._.js
   │  │  │  ├─ pages__app_6766edb5._.js.map
   │  │  │  ├─ pages__app_8bf2d783._.js
   │  │  │  ├─ pages__app_8bf2d783._.js.map
   │  │  │  ├─ pages__app_c87ae4c6._.js
   │  │  │  ├─ pages__app_c87ae4c6._.js.map
   │  │  │  ├─ pages__app_fd6d668e._.js
   │  │  │  ├─ pages__app_fd6d668e._.js.map
   │  │  │  ├─ pages__error_5771e187._.js
   │  │  │  ├─ pages__error_625cb59b._.js
   │  │  │  ├─ pages__error_625cb59b._.js.map
   │  │  │  ├─ pages_index_02d40dcf._.js
   │  │  │  ├─ pages_index_02d40dcf._.js.map
   │  │  │  ├─ pages_index_121b47a5._.js
   │  │  │  ├─ pages_index_121b47a5._.js.map
   │  │  │  ├─ pages_index_4df90da4._.js
   │  │  │  ├─ pages_index_4df90da4._.js.map
   │  │  │  ├─ pages_index_5771e187._.js
   │  │  │  ├─ pages_index_74400e76._.js
   │  │  │  ├─ pages_index_74400e76._.js.map
   │  │  │  ├─ pages_index_7586f3ce._.js
   │  │  │  ├─ pages_index_7586f3ce._.js.map
   │  │  │  ├─ pages_index_8759f578._.js
   │  │  │  ├─ pages_index_8759f578._.js.map
   │  │  │  ├─ pages_index_877d529b._.js
   │  │  │  ├─ pages_index_877d529b._.js.map
   │  │  │  ├─ pages_index_984495a1._.js
   │  │  │  ├─ pages_index_984495a1._.js.map
   │  │  │  ├─ pages_index_cf3c1692._.js
   │  │  │  ├─ pages_index_cf3c1692._.js.map
   │  │  │  ├─ pages_index_fee4ce03._.js
   │  │  │  ├─ pages_index_fee4ce03._.js.map
   │  │  │  ├─ pages_products_search_ui_5771e187.js
   │  │  │  ├─ pages_products_search_ui_b89a4768.js
   │  │  │  ├─ pages_products_search_ui_b89a4768.js.map
   │  │  │  ├─ pages_signin_ui_38ef0386._.js
   │  │  │  ├─ pages_signin_ui_38ef0386._.js.map
   │  │  │  ├─ pages_signin_ui_5771e187._.js
   │  │  │  ├─ pages_signin_ui_58c9cbb6._.js
   │  │  │  ├─ pages_signin_ui_58c9cbb6._.js.map
   │  │  │  ├─ pages_signin_ui_bedfe80b._.js
   │  │  │  ├─ pages_signin_ui_bedfe80b._.js.map
   │  │  │  ├─ pages_signin_ui_ffaabce9._.js
   │  │  │  ├─ pages_signin_ui_ffaabce9._.js.map
   │  │  │  ├─ pages_signup_ui_11429e1b._.js
   │  │  │  ├─ pages_signup_ui_11429e1b._.js.map
   │  │  │  ├─ pages_signup_ui_231824e8._.js
   │  │  │  ├─ pages_signup_ui_231824e8._.js.map
   │  │  │  ├─ pages_signup_ui_26ba4f23._.js
   │  │  │  ├─ pages_signup_ui_26ba4f23._.js.map
   │  │  │  ├─ pages_signup_ui_2f4684c9._.js
   │  │  │  ├─ pages_signup_ui_2f4684c9._.js.map
   │  │  │  ├─ pages_signup_ui_5771e187._.js
   │  │  │  ├─ pages_signup_ui_68b44638._.js
   │  │  │  ├─ pages_signup_ui_68b44638._.js.map
   │  │  │  ├─ pages_signup_ui_71afb4be._.js
   │  │  │  ├─ pages_signup_ui_71afb4be._.js.map
   │  │  │  ├─ pages_signup_ui_7cb7482d._.js
   │  │  │  ├─ pages_signup_ui_7cb7482d._.js.map
   │  │  │  ├─ pages_signup_ui_90617c35._.js
   │  │  │  ├─ pages_signup_ui_90617c35._.js.map
   │  │  │  ├─ pages_signup_ui_a2c8a501._.js
   │  │  │  ├─ pages_signup_ui_a2c8a501._.js.map
   │  │  │  ├─ pages_signup_ui_c91fe6f2._.js
   │  │  │  ├─ pages_signup_ui_c91fe6f2._.js.map
   │  │  │  ├─ pages_signup_ui_d3fffab8._.js
   │  │  │  ├─ pages_signup_ui_d3fffab8._.js.map
   │  │  │  ├─ pages_signup_ui_e087a49f._.js
   │  │  │  ├─ pages_signup_ui_e087a49f._.js.map
   │  │  │  ├─ pages_test_page_5771e187._.js
   │  │  │  ├─ pages_test_page_9340c94c._.js
   │  │  │  ├─ pages_test_page_9340c94c._.js.map
   │  │  │  ├─ pages_user_cart_09c66342._.js
   │  │  │  ├─ pages_user_cart_09c66342._.js.map
   │  │  │  ├─ pages_user_cart_217ac93d._.js
   │  │  │  ├─ pages_user_cart_217ac93d._.js.map
   │  │  │  ├─ pages_user_cart_5771e187._.js
   │  │  │  ├─ pages_user_cart_7c4aed94._.js
   │  │  │  ├─ pages_user_cart_7c4aed94._.js.map
   │  │  │  ├─ pages_user_cart_a8e17290._.js
   │  │  │  ├─ pages_user_cart_a8e17290._.js.map
   │  │  │  ├─ pages_user_cart_feefefd3._.js
   │  │  │  ├─ pages_user_cart_feefefd3._.js.map
   │  │  │  ├─ pages_user_profile_3ee97374._.js
   │  │  │  ├─ pages_user_profile_3ee97374._.js.map
   │  │  │  ├─ pages_user_profile_5771e187._.js
   │  │  │  ├─ pages_user_profile_5b9cdcff._.js
   │  │  │  ├─ pages_user_profile_5b9cdcff._.js.map
   │  │  │  ├─ pages_user_profile_bec4fbee._.js
   │  │  │  ├─ pages_user_profile_bec4fbee._.js.map
   │  │  │  ├─ pages_user_profile_cf7c7c2e._.js
   │  │  │  ├─ pages_user_profile_cf7c7c2e._.js.map
   │  │  │  ├─ pages_user_profile_e67e61b7._.js
   │  │  │  ├─ pages_user_profile_e67e61b7._.js.map
   │  │  │  ├─ public_car_engine_closeup_png_ba3284f5._.css
   │  │  │  ├─ public_car_engine_closeup_png_ba3284f5._.css.map
   │  │  │  ├─ public_fonts_Sansation_Regular_ttf_ba3284f5._.css
   │  │  │  ├─ public_fonts_Sansation_Regular_ttf_ba3284f5._.css.map
   │  │  │  ├─ styles_0beb5d79._.css
   │  │  │  ├─ styles_0beb5d79._.css.map
   │  │  │  ├─ styles_1558767b._.css
   │  │  │  ├─ styles_1558767b._.css.map
   │  │  │  ├─ styles_175899b5._.css
   │  │  │  ├─ styles_175899b5._.css.map
   │  │  │  ├─ styles_2c17de85._.css
   │  │  │  ├─ styles_2c17de85._.css.map
   │  │  │  ├─ styles_639a3535._.css
   │  │  │  ├─ styles_639a3535._.css.map
   │  │  │  ├─ styles_96a9a808._.css
   │  │  │  ├─ styles_96a9a808._.css.map
   │  │  │  ├─ styles_cc703e06._.css
   │  │  │  ├─ styles_cc703e06._.css.map
   │  │  │  ├─ styles_footer_module_73511378.css
   │  │  │  ├─ styles_footer_module_73511378.css.map
   │  │  │  ├─ styles_globals_73511378.css
   │  │  │  ├─ styles_globals_73511378.css.map
   │  │  │  ├─ styles_globals_79636149.css
   │  │  │  ├─ styles_globals_79636149.css.map
   │  │  │  ├─ styles_nav_module_73511378.css
   │  │  │  ├─ styles_nav_module_73511378.css.map
   │  │  │  ├─ styles_nav_module_f3a2a22e.css
   │  │  │  ├─ styles_nav_module_f3a2a22e.css.map
   │  │  │  ├─ styles_search_ui_module_73511378.css
   │  │  │  ├─ styles_search_ui_module_73511378.css.map
   │  │  │  ├─ styles_signin_module_73511378.css
   │  │  │  ├─ styles_signin_module_73511378.css.map
   │  │  │  ├─ styles_signup_module_73511378.css
   │  │  │  ├─ styles_signup_module_73511378.css.map
   │  │  │  ├─ styles_user_cart_module_73511378.css
   │  │  │  ├─ styles_user_cart_module_73511378.css.map
   │  │  │  ├─ styles_user_cart_module_e7f2a56f.css
   │  │  │  ├─ styles_user_cart_module_e7f2a56f.css.map
   │  │  │  ├─ styles_user_profile_module_73511378.css
   │  │  │  └─ styles_user_profile_module_73511378.css.map
   │  │  ├─ development
   │  │  │  ├─ _buildManifest.js
   │  │  │  ├─ _clientMiddlewareManifest.json
   │  │  │  └─ _ssgManifest.js
   │  │  └─ media
   │  │     ├─ Sansation_Regular.7bb5dcf0.ttf
   │  │     ├─ car_engine_closeup.b1ff7dbe.png
   │  │     ├─ favicon.45db1c09.ico
   │  │     ├─ gyByhwUxId8gMEwSGFWNOITddY4-s.81df3a5b.woff2
   │  │     ├─ gyByhwUxId8gMEwcGFWNOITd-s.p.da1ebef7.woff2
   │  │     ├─ or3nQ6H_1_WfwkMZI_qYFrcdmhHkjko-s.p.be19f591.woff2
   │  │     └─ or3nQ6H_1_WfwkMZI_qYFrkdmhHkjkotbA-s.e32db976.woff2
   │  └─ trace
   ├─ README.md
   ├─ components
   │  ├─ footer.js
   │  └─ nav.js
   ├─ hooks
   │  └─ checkAuth.js
   ├─ jsconfig.json
   ├─ lib
   │  ├─ db.js
   │  └─ firebase.js
   ├─ next.config.mjs
   ├─ package-lock.json
   ├─ package.json
   ├─ pages
   │  ├─ _app.js
   │  ├─ api
   │  │  ├─ cart
   │  │  │  ├─ add.js
   │  │  │  ├─ read_by_firebase_uid.js
   │  │  │  └─ remove.js
   │  │  ├─ products
   │  │  │  ├─ create.js
   │  │  │  ├─ delete.js
   │  │  │  ├─ read_all.js
   │  │  │  ├─ read_by_id.js
   │  │  │  ├─ search.js
   │  │  │  └─ update.js
   │  │  └─ users
   │  │     ├─ create.js
   │  │     ├─ delete.js
   │  │     ├─ read_all.js
   │  │     ├─ read_by_firebase_uid.js
   │  │     ├─ read_by_id.js
   │  │     ├─ update.js
   │  │     └─ update_by_firebase_uid.js
   │  ├─ index.js
   │  ├─ products
   │  │  └─ search_ui.js
   │  ├─ signin_ui.js
   │  ├─ signup_ui.js
   │  ├─ user_cart.js
   │  └─ user_profile.js
   ├─ public
   │  ├─ 1993_ford_ranger_brake_alternator.webp
   │  ├─ 1993_ford_ranger_brake_pads.webp
   │  ├─ car_engine_closeup.png
   │  ├─ cart_icon.png
   │  ├─ fonts
   │  │  └─ Sansation_Regular.ttf
   │  └─ lugnuts_logo.png
   └─ styles
      ├─ footer.module.css
      ├─ globals.css
      ├─ nav.module.css
      ├─ search_ui.module.css
      ├─ signin.module.css
      ├─ signup.module.css
      ├─ user_cart.module.css
      └─ user_profile.module.css

```