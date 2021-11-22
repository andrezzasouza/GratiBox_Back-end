CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"plan_id" integer UNIQUE,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "addresses" (
	"id" serial NOT NULL,
	"state_id" integer NOT NULL,
	"city" varchar(255) NOT NULL,
	"cep" varchar(8) NOT NULL,
	"street" varchar(255) NOT NULL,
	"addressee" varchar(255) NOT NULL,
	CONSTRAINT "addresses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "states" (
	"id" serial NOT NULL,
	"name" varchar(2) NOT NULL UNIQUE,
	CONSTRAINT "states_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "plans" (
	"id" serial NOT NULL,
	"delivery_day_id" integer NOT NULL,
	"subscription_date" DATE NOT NULL DEFAULT NOW(),
	"address_id" integer NOT NULL,
	"cancel_date" DATE,
	CONSTRAINT "plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" varchar(20) NOT NULL UNIQUE,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "plans_products" (
	"id" serial NOT NULL,
	"products_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	CONSTRAINT "plans_products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(40) NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "delivery_days" (
	"id" serial NOT NULL,
	"day" varchar(25) NOT NULL UNIQUE,
	CONSTRAINT "delivery_days_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk0" FOREIGN KEY ("state_id") REFERENCES "states"("id");
ALTER TABLE "plans" ADD CONSTRAINT "plans_fk0" FOREIGN KEY ("delivery_day_id") REFERENCES "delivery_days"("id");
ALTER TABLE "plans" ADD CONSTRAINT "plans_fk1" FOREIGN KEY ("address_id") REFERENCES "addresses"("id");
ALTER TABLE "plans_products" ADD CONSTRAINT "plans_products_fk0" FOREIGN KEY ("products_id") REFERENCES "products"("id");
ALTER TABLE "plans_products" ADD CONSTRAINT "plans_products_fk1" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
