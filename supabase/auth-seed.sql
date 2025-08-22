SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'eac9a034-7cc5-4b29-a9a3-3b347183ff48', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"admin@contractorpro.com","user_id":"17f4cf87-5693-4167-a429-71020015288f","user_phone":""}}', '2025-08-07 18:47:54.53678+00', ''),
	('00000000-0000-0000-0000-000000000000', '306ac400-7267-459e-aab7-f172e6fffddc', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-07 18:48:41.343034+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f08cb599-f4f0-4368-b523-a494a645a533', '{"action":"user_repeated_signup","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-08-07 19:07:02.249669+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b461bd53-a2f8-4d87-9c51-cd46556e2d2a', '{"action":"user_confirmation_requested","actor_id":"901989ab-e3d5-407b-ac40-6740e83131ac","actor_username":"admixdn@contractorpro.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-08-07 19:07:19.913216+00', ''),
	('00000000-0000-0000-0000-000000000000', '900ae12f-c703-4a2e-bb16-719f146ccb96', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admixdn@contractorpro.com","user_id":"901989ab-e3d5-407b-ac40-6740e83131ac","user_phone":""}}', '2025-08-07 19:08:18.977262+00', ''),
	('00000000-0000-0000-0000-000000000000', '461ff5a1-61f4-4edb-b469-c6aa2b5f99e1', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-07 19:23:09.296026+00', ''),
	('00000000-0000-0000-0000-000000000000', '156bc4ca-b44b-4868-9fbc-2b942b108ca8', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-07 20:21:51.474349+00', ''),
	('00000000-0000-0000-0000-000000000000', '63d6e281-c11b-4f94-9042-69c9ecbe61c0', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-07 20:21:51.484298+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b87f247a-2d63-4a0a-a432-50f446478890', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-07 20:35:37.424354+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a40bbc67-874f-407b-b4ba-25df95979d86', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-07 21:41:16.686858+00', ''),
	('00000000-0000-0000-0000-000000000000', '53dc213f-09d8-4c86-8b9b-bf47dc69aae7', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-07 21:41:16.695449+00', ''),
	('00000000-0000-0000-0000-000000000000', '323df9e4-500c-462b-8309-c1693496b5ea', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-07 22:50:30.537834+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1454933-3107-42ee-9032-bd4b4f58630a', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-07 22:50:30.550943+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4444418-83a5-461a-bd34-86ca16e40f0f', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-07 23:26:32.969473+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b9c08aa-6bd9-45f7-975d-c4a681d99acb', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 00:33:15.518871+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc35ee1a-2ec6-4aa7-acea-386fa1c36299', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 00:33:15.525964+00', ''),
	('00000000-0000-0000-0000-000000000000', '80f1d301-d497-4c4f-9448-cd1f605c91ef', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-08 00:33:43.688085+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e92626e4-d510-4dc2-b4be-20f00a828912', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 00:33:58.656369+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b2648af-05e3-49ea-96ac-b254b55ce488', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-08 00:34:50.238277+00', ''),
	('00000000-0000-0000-0000-000000000000', '42bde7f1-58c5-419e-a32e-08a98e951f0e', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 00:34:54.806616+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f096b76-eab9-469a-9b6b-227644121f59', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 00:48:10.053703+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af890a63-0a00-4c99-a37f-82aa0a8155e5', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-08 01:45:26.224357+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f93d14d1-d193-4d80-a8e5-7e21eafac718', '{"action":"user_signedup","actor_id":"7b4611ad-da69-4ff7-b4f8-c70e70dac3d2","actor_username":"admjjin@contractorpro.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-08-08 01:45:31.811009+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd39ec625-1f18-40c0-950d-406db5f4468d', '{"action":"login","actor_id":"7b4611ad-da69-4ff7-b4f8-c70e70dac3d2","actor_username":"admjjin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 01:45:31.822363+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf9ae6ca-a396-4c24-a670-e26952ef2209', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admjjin@contractorpro.com","user_id":"7b4611ad-da69-4ff7-b4f8-c70e70dac3d2","user_phone":""}}', '2025-08-08 01:46:15.502921+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ea9a99c-1850-4b23-be06-6c95ff18d7b2', '{"action":"user_confirmation_requested","actor_id":"f8177cd5-27dd-421b-855b-681051e6116d","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-08-08 01:49:53.714579+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a660317-3fac-49ed-bd49-bcddde75498e', '{"action":"user_signedup","actor_id":"f8177cd5-27dd-421b-855b-681051e6116d","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-08-08 01:50:43.493887+00', ''),
	('00000000-0000-0000-0000-000000000000', '2399fc0b-9c79-4356-9960-b6d76b468909', '{"action":"login","actor_id":"f8177cd5-27dd-421b-855b-681051e6116d","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 01:51:50.584776+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a16e40b-5426-4b67-8e61-e6eb6a4994fa', '{"action":"login","actor_id":"f8177cd5-27dd-421b-855b-681051e6116d","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}', '2025-08-08 01:52:03.816842+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a71a60da-cde2-4221-8592-170fd41bda1b', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 01:52:12.01036+00', ''),
	('00000000-0000-0000-0000-000000000000', '37a1b498-affc-4b80-ae06-1c5b1c07f3c0', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-08 01:52:18.592586+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba8a459b-4f1d-42ca-bac9-1c04c2f6088b', '{"action":"login","actor_id":"f8177cd5-27dd-421b-855b-681051e6116d","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 01:53:12.219708+00', ''),
	('00000000-0000-0000-0000-000000000000', '2be88a20-1c7d-40fb-be33-4eb29cc45297', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nickybcotroni@gmail.com","user_id":"f8177cd5-27dd-421b-855b-681051e6116d","user_phone":""}}', '2025-08-08 01:57:17.994269+00', ''),
	('00000000-0000-0000-0000-000000000000', '1499d934-e864-4be6-8863-1c8656fb2cdc', '{"action":"user_confirmation_requested","actor_id":"3c2e2d7d-9807-4906-bc5f-20588bc2791c","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-08-08 01:57:39.655393+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e271a065-61d2-4845-a801-e488b70a236a', '{"action":"user_signedup","actor_id":"3c2e2d7d-9807-4906-bc5f-20588bc2791c","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-08-08 01:58:37.026353+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9e5472a-70cc-4e73-9043-be75b0a3c547', '{"action":"login","actor_id":"3c2e2d7d-9807-4906-bc5f-20588bc2791c","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 01:59:22.040239+00', ''),
	('00000000-0000-0000-0000-000000000000', '080ec85c-d82f-405d-9e23-5e9baad3d70d', '{"action":"login","actor_id":"3c2e2d7d-9807-4906-bc5f-20588bc2791c","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}', '2025-08-08 01:59:36.92534+00', ''),
	('00000000-0000-0000-0000-000000000000', '866affad-4126-484d-94e1-cb8302c704ff', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nickybcotroni@gmail.com","user_id":"3c2e2d7d-9807-4906-bc5f-20588bc2791c","user_phone":""}}', '2025-08-08 02:02:07.305615+00', ''),
	('00000000-0000-0000-0000-000000000000', '445e8f3b-e620-4157-822b-ef14b51fcf78', '{"action":"user_confirmation_requested","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-08-08 02:12:19.40747+00', ''),
	('00000000-0000-0000-0000-000000000000', '5decba16-fa8a-48ce-b4c4-692021e81217', '{"action":"user_signedup","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-08-08 02:13:34.047047+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec1f6e89-f54b-40b5-a468-a325e08e887b', '{"action":"login","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 02:13:38.241275+00', ''),
	('00000000-0000-0000-0000-000000000000', '31d39518-b3d2-46b5-9903-150e21d0e0c2', '{"action":"logout","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-08 02:26:34.321143+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e75bfda-adde-4afc-b18f-9a8f2257a4bf', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 02:26:41.186813+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fc39488-5df5-4fa6-9f49-c2d9583968ec', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-08 02:26:48.137483+00', ''),
	('00000000-0000-0000-0000-000000000000', '45039441-973b-4ac5-95c6-1fd3cfac4314', '{"action":"login","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 02:26:55.232412+00', ''),
	('00000000-0000-0000-0000-000000000000', '416b3b22-baf5-48d4-971b-ef4f35557738', '{"action":"token_refreshed","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 04:28:01.335001+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f720dd86-c5e6-4b5a-ad5c-89407685e625', '{"action":"token_revoked","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 04:28:01.354535+00', ''),
	('00000000-0000-0000-0000-000000000000', '35642067-45a6-4a58-bbe8-f9f446b39a9a', '{"action":"token_refreshed","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 17:51:18.007028+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e57cf3e-0a5c-4907-afac-77fdedc8448b', '{"action":"token_revoked","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-08-08 17:51:18.022749+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da703c19-ca35-40df-810b-c277a13d5ef7', '{"action":"logout","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-08 17:52:54.934456+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f44c216d-f3d2-4386-b0f8-96e7c20c4221', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-08 17:53:06.148615+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc5020a6-d3ca-40e5-8a2f-bd7f0cb6de83', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 02:12:11.780923+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5585595-35c2-469b-a916-2857e75eba45', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 02:12:11.808694+00', ''),
	('00000000-0000-0000-0000-000000000000', '12dfdd93-8c7b-4556-a51c-304593c0b122', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-09 02:12:13.215224+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa7f3d62-9191-4db1-81ea-7bc4bb2d9913', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 02:41:00.513397+00', ''),
	('00000000-0000-0000-0000-000000000000', '012603f3-4218-4709-ab45-ac42077133b1', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 03:25:16.217826+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf04bcb3-4591-4763-b913-ce47bec723af', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 03:46:45.921005+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f089a043-bbf7-40d5-83f3-065bb1ada250', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 04:00:08.277207+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd4fa058a-1fc7-4c4a-8f00-98454deff0a8', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 18:35:00.228284+00', ''),
	('00000000-0000-0000-0000-000000000000', '1fb6b42c-4c53-4555-beca-024b898a439b', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 18:35:00.243554+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f793a3b-883d-48f2-92bc-8b9734cf2855', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-09 18:53:35.146054+00', ''),
	('00000000-0000-0000-0000-000000000000', '264dd0ea-0cce-4f71-a252-79ca10980b35', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 18:54:26.950906+00', ''),
	('00000000-0000-0000-0000-000000000000', '61539220-4f5f-4d30-a34a-9021f4320131', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 18:55:19.248125+00', ''),
	('00000000-0000-0000-0000-000000000000', '6caf1488-2cd7-42c0-bd1c-486be2a6c5ad', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-09 19:34:31.289093+00', ''),
	('00000000-0000-0000-0000-000000000000', '291f5fc3-8844-4990-aa3e-744229a82a90', '{"action":"login","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 19:34:38.823606+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a14eeeb1-e9e2-4df4-909e-4e5ce1e76783', '{"action":"logout","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-09 19:35:32.407673+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d162795-03f6-4edc-82eb-3fa9752f7bcf', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 19:35:53.072923+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac098b25-abac-4cfa-919e-c13a9683c24c', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 20:34:13.061447+00', ''),
	('00000000-0000-0000-0000-000000000000', '56186c74-fd37-4bb0-af30-afb9113fcd09', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-09 20:34:13.0748+00', ''),
	('00000000-0000-0000-0000-000000000000', 'beffd5e9-de2e-407a-9bfd-060a84fc25f6', '{"action":"login","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-09 23:33:34.312942+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c01af49-2415-4bd4-9c23-cfbccc0bef47', '{"action":"logout","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-08-09 23:37:51.012921+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e41a42c-59d5-471a-a043-0ee8cfa24955', '{"action":"login","actor_id":"d22b7df8-e70f-4e54-87d8-4d39308fc0d0","actor_username":"nickybcotroni@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-10 00:48:21.587846+00', ''),
	('00000000-0000-0000-0000-000000000000', '0331da59-be0a-456b-a384-58694fd04716', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-10 01:27:46.424328+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bee4074f-aa49-43f2-8874-beefbeb10a11', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-10 01:27:46.449403+00', ''),
	('00000000-0000-0000-0000-000000000000', '828a875b-dbc2-4479-b4dd-1848b85f6d9a', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 18:07:10.017702+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f09befd4-766a-4611-a28d-983779d6e3dd', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 18:23:17.473141+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f89456a3-8655-40c0-8914-092b9c251416', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-21 18:40:42.998037+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfe918c5-7686-42fe-aa08-f29356d75c4b', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 18:40:55.816747+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4172ad5-cf86-4a45-82a2-c7eddddc9a80', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-21 19:39:35.308552+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cfed586d-f2f2-4685-aabc-b05169676014', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-21 19:39:35.328618+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1b1cb85-5317-492d-a713-636ef5dfafc8', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-21 20:26:28.2226+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f19287b-3262-44ce-bc91-6e0ec79f7caa', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 20:26:36.05793+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4dacda9-498c-43e9-ab18-9ead67783956', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 20:40:12.546904+00', ''),
	('00000000-0000-0000-0000-000000000000', '202295df-563b-47d1-a042-29ffd64b5f6f', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-21 20:50:17.240477+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d47b5a3-8f13-4c02-aa69-dc76020e8e78', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 20:50:22.453338+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d4d46e6-2fc9-4c3b-840f-b3f94dfcdef9', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-21 20:53:43.94422+00', ''),
	('00000000-0000-0000-0000-000000000000', '00b9afb9-bd87-40e2-9cb0-7cfd360d58dc', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 20:53:47.18526+00', ''),
	('00000000-0000-0000-0000-000000000000', '27eb9657-6c85-47ad-b429-06b28f780b5b', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 20:54:37.106579+00', ''),
	('00000000-0000-0000-0000-000000000000', '812a83ca-b04d-4549-b389-eafe854ea86a', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-21 20:55:59.885555+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d3a5aef-7627-469c-974e-84658c3427e3', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 20:56:10.2673+00', ''),
	('00000000-0000-0000-0000-000000000000', '683d2b57-4a2a-499b-9795-23e6906eec07', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-21 20:57:38.666358+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b9ee78c-d8e2-4c6a-8e36-a2682600ac36', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 20:58:00.881112+00', ''),
	('00000000-0000-0000-0000-000000000000', '52ee6643-1f89-4bf0-a4e2-5eb966314572', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-08-21 21:55:36.799743+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8b1cd85-0cd8-4cd9-b99b-bc1721f1bff7', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 21:58:30.078644+00', ''),
	('00000000-0000-0000-0000-000000000000', '31f7748b-3237-4872-8844-d5cb7005e75c', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-21 22:28:17.727186+00', ''),
	('00000000-0000-0000-0000-000000000000', '201bf502-a5ac-488b-8ac5-db251fc9743c', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-21 23:27:06.407007+00', ''),
	('00000000-0000-0000-0000-000000000000', '49903e47-8646-4be0-93a2-f6603688637b', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-21 23:27:06.431191+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('ba8a1453-78ac-48a7-9fb5-165ada80f015', '901989ab-e3d5-407b-ac40-6740e83131ac', 'b3788d2b-31b0-4396-bcf0-64acc3799ea0', 's256', '65aGLP3QymdFWrJ33hoY5Tkv7N-aCWoZFKooHQUCAJs', 'email', '', '', '2025-08-07 19:07:19.914532+00', '2025-08-07 19:07:19.914532+00', 'email/signup', NULL),
	('380f9f77-8ef2-4ddf-a68c-2371aa079d7b', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', '58ee7ebe-0df4-4e06-9bac-550be8b2d280', 's256', 'NlzPN1xr60nYZkfhXu8t2NpZREpKYX-0TJSB-e7Byl4', 'email', '', '', '2025-08-08 02:12:19.409549+00', '2025-08-08 02:13:34.10366+00', 'email/signup', '2025-08-08 02:13:34.103603+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '17f4cf87-5693-4167-a429-71020015288f', 'authenticated', 'authenticated', 'admin@contractorpro.com', '$2a$10$jY9aDIoUoSzmIr96HBS8Lu81Zx5UGVbtJ9.WCzNXv3yTkl3AzboS2', '2025-08-07 18:47:54.542693+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-08-21 22:28:17.739422+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-08-07 18:47:54.526555+00', '2025-08-21 23:27:06.463364+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', 'authenticated', 'authenticated', 'nickybcotroni@gmail.com', '$2a$10$cyvIZ2OUbglilO652tnrQu7g3/n8XoX5IVNSXNNuw8bZrxUhgxaq.', '2025-08-08 02:13:34.055898+00', NULL, '', '2025-08-08 02:12:19.413519+00', '', NULL, '', '', NULL, '2025-08-10 00:48:21.609943+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d22b7df8-e70f-4e54-87d8-4d39308fc0d0", "email": "nickybcotroni@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-08-08 02:12:19.377624+00', '2025-08-10 00:48:21.647497+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('17f4cf87-5693-4167-a429-71020015288f', '17f4cf87-5693-4167-a429-71020015288f', '{"sub": "17f4cf87-5693-4167-a429-71020015288f", "email": "admin@contractorpro.com", "email_verified": false, "phone_verified": false}', 'email', '2025-08-07 18:47:54.533761+00', '2025-08-07 18:47:54.533813+00', '2025-08-07 18:47:54.533813+00', '2218eb62-5c6f-473f-8e18-4490bdbb056e'),
	('d22b7df8-e70f-4e54-87d8-4d39308fc0d0', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', '{"sub": "d22b7df8-e70f-4e54-87d8-4d39308fc0d0", "email": "nickybcotroni@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2025-08-08 02:12:19.400208+00', '2025-08-08 02:12:19.400974+00', '2025-08-08 02:12:19.400974+00', 'a92ebecb-dadf-4e77-bbf4-5c18dc19addd');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('0947bfd4-46dc-46d8-ad08-bc4337932247', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', '2025-08-10 00:48:21.610042+00', '2025-08-10 00:48:21.610042+00', NULL, 'aal1', NULL, NULL, 'node', '3.236.21.255', NULL),
	('fd3eccf4-dee8-4096-ab40-db00a5e17754', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-21 21:58:30.09085+00', '2025-08-21 21:58:30.09085+00', NULL, 'aal1', NULL, NULL, 'node', '3.81.31.183', NULL),
	('a987e2df-7e05-48f4-aa96-74488c58db6b', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-21 22:28:17.739506+00', '2025-08-21 23:27:06.506501+00', NULL, 'aal1', NULL, '2025-08-21 23:27:06.506417', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '142.170.42.183', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('0947bfd4-46dc-46d8-ad08-bc4337932247', '2025-08-10 00:48:21.674806+00', '2025-08-10 00:48:21.674806+00', 'password', '5061722f-4057-4663-9276-894e1ca3f056'),
	('fd3eccf4-dee8-4096-ab40-db00a5e17754', '2025-08-21 21:58:30.113687+00', '2025-08-21 21:58:30.113687+00', 'password', 'dad29964-f375-4739-82d2-c3a117007521'),
	('a987e2df-7e05-48f4-aa96-74488c58db6b', '2025-08-21 22:28:17.778033+00', '2025-08-21 22:28:17.778033+00', 'password', 'a393960e-38d0-4c40-b2cc-ddc836f343d9');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 37, 'ijcf3foxlvor', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', false, '2025-08-10 00:48:21.626697+00', '2025-08-10 00:48:21.626697+00', NULL, '0947bfd4-46dc-46d8-ad08-bc4337932247'),
	('00000000-0000-0000-0000-000000000000', 50, 'bw6n44h7cdrv', '17f4cf87-5693-4167-a429-71020015288f', false, '2025-08-21 21:58:30.096594+00', '2025-08-21 21:58:30.096594+00', NULL, 'fd3eccf4-dee8-4096-ab40-db00a5e17754'),
	('00000000-0000-0000-0000-000000000000', 51, 'jonxvdsqisqb', '17f4cf87-5693-4167-a429-71020015288f', true, '2025-08-21 22:28:17.749457+00', '2025-08-21 23:27:06.431804+00', NULL, 'a987e2df-7e05-48f4-aa96-74488c58db6b'),
	('00000000-0000-0000-0000-000000000000', 52, '7trlw7g4kdyk', '17f4cf87-5693-4167-a429-71020015288f', false, '2025-08-21 23:27:06.453167+00', '2025-08-21 23:27:06.453167+00', 'jonxvdsqisqb', 'a987e2df-7e05-48f4-aa96-74488c58db6b');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 52, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
