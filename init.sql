CREATE TABLE "User" (
   "Id_User" SERIAL,
   "user_name" VARCHAR(100) NOT NULL,
   "user_last_name" VARCHAR(100) NOT NULL,
   "birth_date" DATE NOT NULL,
   "email" VARCHAR(255) NOT NULL,
   "password" VARCHAR(255) NOT NULL,
   "email" VARCHAR(100) NOT NULL,
   "role" VARCHAR(50) NOT NULL,
   "wallet_balance" DECIMAL(15,2) DEFAULT 0.00,
   PRIMARY KEY ("Id_User")
);

CREATE TABLE "Property" (
   "Id_Property" SERIAL,
   "property_name" VARCHAR(50) NOT NULL,
   "property_type" VARCHAR(50) NOT NULL,
   "property_price" DECIMAL(15,2) NOT NULL,
   "rental_income_rate" DECIMAL(5,2) DEFAULT 0.00,
   "appreciation_rate" DECIMAL(5,2) DEFAULT 0.00,
   "funding_deadline" TIMESTAMP NOT NULL,
   "status" VARCHAR(50) NOT NULL DEFAULT 'closed',
   "Id_User" INT,
   PRIMARY KEY ("Id_Property"),
   CONSTRAINT fk_user FOREIGN KEY ("Id_User") REFERENCES "User" ("Id_User") ON DELETE SET NULL
);

CREATE TABLE "Investment" (
   "Id_Investment" SERIAL,
   "investment_amount" DECIMAL(15,2) NOT NULL,
   "investment_share" DECIMAL(5,2) NOT NULL,
   "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   "Id_Property" INT NOT NULL,
   "Id_User" INT NOT NULL,
   PRIMARY KEY ("Id_Investment"),
   CONSTRAINT fk_property FOREIGN KEY ("Id_Property") REFERENCES "Property" ("Id_Property") ON DELETE CASCADE,
   CONSTRAINT fk_invest_user FOREIGN KEY ("Id_User") REFERENCES "User" ("Id_User") ON DELETE CASCADE
);

CREATE TABLE "Wallet_Transaction" (
   "Id_Wallet_Transaction" SERIAL,
   "transaction_type" VARCHAR(50) NOT NULL,
   "transaction_amount" DECIMAL(15,2) NOT NULL,
   "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   "Id_User" INT NOT NULL,
   PRIMARY KEY ("Id_Wallet_Transaction"),
   CONSTRAINT fk_wallet_user FOREIGN KEY ("Id_User") REFERENCES "User" ("Id_User") ON DELETE CASCADE
);

CREATE TABLE "Payment_Transaction" (
   "Id_Payment_Transaction" SERIAL,
   "payment_amount" DECIMAL(15,2) NOT NULL,
   "status" VARCHAR(50) NOT NULL,
   "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   "Id_User" INT NOT NULL,
   PRIMARY KEY ("Id_Payment_Transaction"),
   CONSTRAINT fk_payment_user FOREIGN KEY ("Id_User") REFERENCES "User" ("Id_User") ON DELETE CASCADE
);

CREATE TABLE "Notifications" (
   "Id_Notifications" SERIAL,
   "content" VARCHAR(255) NOT NULL,
   "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   "Id_User" INT NOT NULL,
   PRIMARY KEY ("Id_Notifications"),
   CONSTRAINT fk_notifications_user FOREIGN KEY ("Id_User") REFERENCES "User" ("Id_User") ON DELETE CASCADE
);
