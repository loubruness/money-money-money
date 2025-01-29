CREATE TABLE "User" (
   "Id_User" SERIAL,
   "user_name" VARCHAR(100) NOT NULL,
   "user_last_name" VARCHAR(100) NOT NULL,
   "birth_date" DATE NOT NULL,
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


/* Users */
INSERT INTO "User" ("user_name", "user_last_name", "birth_date", "email", "password", "role", "wallet_balance")
VALUES ('admin', 'User', '1970-01-01', 'admin@example.com', 'adminpassword', 'admin', 1000.00);
INSERT INTO "User" ("user_name", "user_last_name", "birth_date", "email", "password", "role", "wallet_balance")
VALUES ('agent 1', 'User', '1970-01-02', 'agent1@example.com', 'agent1password', 'agent', 1000.00);
INSERT INTO "User" ("user_name", "user_last_name", "birth_date", "email", "password", "role", "wallet_balance")
VALUES ('investor 1', 'User', '1970-01-03', 'investor1@example.com', 'investor1password', 'investor', 1000.00);
INSERT INTO "User" ("user_name", "user_last_name", "birth_date", "email", "password", "role", "wallet_balance")
VALUES ('investor 2', 'User', '1970-01-04', 'investor2@example.com', 'investor2password', 'investor', 2000.00);

/* Properties */
INSERT INTO "Property" ("property_name", "property_type", "property_price", "rental_income_rate", "appreciation_rate", "funding_deadline", "Id_User")
VALUES ('Property 1', 'House', 100000.00, 0.00, 0.00, '2021-12-31 23:59:59', 2);
INSERT INTO "Property" ("property_name", "property_type", "property_price", "rental_income_rate", "appreciation_rate", "funding_deadline", "Id_User")
VALUES ('Property 2', 'Apartment', 200000.00, 0.00, 0.00, '2021-12-31 23:59:59', 2);

/* Investments */
INSERT INTO "Investment" ("investment_amount", "investment_share", "Id_Property", "Id_User")
VALUES (1000.00, 10.00, 1, 3);
INSERT INTO "Investment" ("investment_amount", "investment_share", "Id_Property", "Id_User")
VALUES (2000.00, 20.00, 1, 4);
INSERT INTO "Investment" ("investment_amount", "investment_share", "Id_Property", "Id_User")
VALUES (3000.00, 30.00, 2, 4);