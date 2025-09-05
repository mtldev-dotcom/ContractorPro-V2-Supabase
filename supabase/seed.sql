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
	('00000000-0000-0000-0000-000000000000', '49903e47-8646-4be0-93a2-f6603688637b', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-21 23:27:06.431191+00', ''),
	('00000000-0000-0000-0000-000000000000', '3ef34661-217d-49cf-bcd6-aeed0db86fe3', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-22 03:05:56.5153+00', ''),
	('00000000-0000-0000-0000-000000000000', '3bb92c54-4d61-4ae8-a605-69792e26d0e8', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-22 03:05:56.52671+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c23b5754-dfe8-4ad3-84d7-599bd43a29dd', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-22 18:29:19.171227+00', ''),
	('00000000-0000-0000-0000-000000000000', '1cc9255e-7faf-41e3-8ab2-e57effbd0951', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-22 18:29:19.197956+00', ''),
	('00000000-0000-0000-0000-000000000000', '9161474f-e37f-418a-accc-09b6e026d960', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-22 19:27:56.314733+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e16b38c4-350e-48bb-b6be-041b0b911865', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-08-22 19:27:56.325206+00', ''),
	('00000000-0000-0000-0000-000000000000', '81d43a80-b0e6-4d34-a70d-a77759931875', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 17:25:24.099555+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2872056-62e8-42fc-bc02-bce4bb8fc0a9', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 17:25:24.12934+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a99f760e-619e-4ab0-b30e-ca0873d21c57', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-09-04 17:25:27.185263+00', ''),
	('00000000-0000-0000-0000-000000000000', '2153433e-d6cb-499f-9bc3-677d51ca7c85', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-04 17:25:45.030643+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb1e61e0-1692-4162-bd44-d1a17984835b', '{"action":"token_refreshed","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 21:06:06.385675+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d1355ed-0b38-47ce-a3db-af0dd9e8547f', '{"action":"token_revoked","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"token"}', '2025-09-04 21:06:06.409682+00', ''),
	('00000000-0000-0000-0000-000000000000', '6743068d-2fb3-4ecf-af17-e362e134e517', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-05 00:44:17.115062+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fdd2dce4-02b4-4e08-b379-b52775c93aff', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-05 01:22:23.574598+00', ''),
	('00000000-0000-0000-0000-000000000000', '821b4be6-3b86-48e7-9049-a7d862e4e064', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-09-05 01:22:34.416586+00', ''),
	('00000000-0000-0000-0000-000000000000', '440cafce-6821-4831-9582-8112b019bd9f', '{"action":"user_confirmation_requested","actor_id":"ed9b0d7f-2078-4c1c-a017-26540e20e7ae","actor_username":"me@nickybruno.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-05 01:22:40.345464+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c6bd715-bbb5-441b-a423-08f02787f6bd', '{"action":"login","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-05 01:23:48.203193+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de2a8dc7-f3f1-4986-a188-37b2927ef479', '{"action":"logout","actor_id":"17f4cf87-5693-4167-a429-71020015288f","actor_username":"admin@contractorpro.com","actor_via_sso":false,"log_type":"account"}', '2025-09-05 01:24:21.319308+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('ba8a1453-78ac-48a7-9fb5-165ada80f015', '901989ab-e3d5-407b-ac40-6740e83131ac', 'b3788d2b-31b0-4396-bcf0-64acc3799ea0', 's256', '65aGLP3QymdFWrJ33hoY5Tkv7N-aCWoZFKooHQUCAJs', 'email', '', '', '2025-08-07 19:07:19.914532+00', '2025-08-07 19:07:19.914532+00', 'email/signup', NULL),
	('380f9f77-8ef2-4ddf-a68c-2371aa079d7b', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', '58ee7ebe-0df4-4e06-9bac-550be8b2d280', 's256', 'NlzPN1xr60nYZkfhXu8t2NpZREpKYX-0TJSB-e7Byl4', 'email', '', '', '2025-08-08 02:12:19.409549+00', '2025-08-08 02:13:34.10366+00', 'email/signup', '2025-08-08 02:13:34.103603+00'),
	('ce6b8082-bddf-4db4-a9af-edb9648d6f58', 'ed9b0d7f-2078-4c1c-a017-26540e20e7ae', 'c835d63c-08b2-4270-8cf4-0abacfe0091f', 's256', 'bmjbx0_KCBMld8cEvQU3WreWLMeqEtP-yR3AM7BJSo8', 'email', '', '', '2025-09-05 01:22:40.346514+00', '2025-09-05 01:22:40.346514+00', 'email/signup', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', 'authenticated', 'authenticated', 'nickybcotroni@gmail.com', '$2a$10$cyvIZ2OUbglilO652tnrQu7g3/n8XoX5IVNSXNNuw8bZrxUhgxaq.', '2025-08-08 02:13:34.055898+00', NULL, '', '2025-08-08 02:12:19.413519+00', '', NULL, '', '', NULL, '2025-08-10 00:48:21.609943+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d22b7df8-e70f-4e54-87d8-4d39308fc0d0", "email": "nickybcotroni@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-08-08 02:12:19.377624+00', '2025-08-10 00:48:21.647497+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ed9b0d7f-2078-4c1c-a017-26540e20e7ae', 'authenticated', 'authenticated', 'me@nickybruno.com', '$2a$10$FB1vyvmFvtfAc9JSbxglvucRina1kWLpEOBH3/Qha0lsdVQ8B2Aqq', NULL, NULL, 'pkce_97d9e4750e2d07385a23e3c3e75a9528ffcadea7bb5715b190737a5f', '2025-09-05 01:22:40.361683+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "ed9b0d7f-2078-4c1c-a017-26540e20e7ae", "email": "me@nickybruno.com", "email_verified": false, "phone_verified": false}', NULL, '2025-09-05 01:22:40.305334+00', '2025-09-05 01:22:40.756172+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '17f4cf87-5693-4167-a429-71020015288f', 'authenticated', 'authenticated', 'admin@contractorpro.com', '$2a$10$jY9aDIoUoSzmIr96HBS8Lu81Zx5UGVbtJ9.WCzNXv3yTkl3AzboS2', '2025-08-07 18:47:54.542693+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-05 01:23:48.207635+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-08-07 18:47:54.526555+00', '2025-09-05 01:23:48.211196+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('17f4cf87-5693-4167-a429-71020015288f', '17f4cf87-5693-4167-a429-71020015288f', '{"sub": "17f4cf87-5693-4167-a429-71020015288f", "email": "admin@contractorpro.com", "email_verified": false, "phone_verified": false}', 'email', '2025-08-07 18:47:54.533761+00', '2025-08-07 18:47:54.533813+00', '2025-08-07 18:47:54.533813+00', '2218eb62-5c6f-473f-8e18-4490bdbb056e'),
	('d22b7df8-e70f-4e54-87d8-4d39308fc0d0', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', '{"sub": "d22b7df8-e70f-4e54-87d8-4d39308fc0d0", "email": "nickybcotroni@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2025-08-08 02:12:19.400208+00', '2025-08-08 02:12:19.400974+00', '2025-08-08 02:12:19.400974+00', 'a92ebecb-dadf-4e77-bbf4-5c18dc19addd'),
	('ed9b0d7f-2078-4c1c-a017-26540e20e7ae', 'ed9b0d7f-2078-4c1c-a017-26540e20e7ae', '{"sub": "ed9b0d7f-2078-4c1c-a017-26540e20e7ae", "email": "me@nickybruno.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-05 01:22:40.336766+00', '2025-09-05 01:22:40.33682+00', '2025-09-05 01:22:40.33682+00', 'a958655b-5bd9-4b7c-9129-29260f561667');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('0947bfd4-46dc-46d8-ad08-bc4337932247', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', '2025-08-10 00:48:21.610042+00', '2025-08-10 00:48:21.610042+00', NULL, 'aal1', NULL, NULL, 'node', '3.236.21.255', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('0947bfd4-46dc-46d8-ad08-bc4337932247', '2025-08-10 00:48:21.674806+00', '2025-08-10 00:48:21.674806+00', 'password', '5061722f-4057-4663-9276-894e1ca3f056');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('0c168580-5b37-4029-abce-d2534c78e2be', 'ed9b0d7f-2078-4c1c-a017-26540e20e7ae', 'confirmation_token', 'pkce_97d9e4750e2d07385a23e3c3e75a9528ffcadea7bb5715b190737a5f', 'me@nickybruno.com', '2025-09-05 01:22:40.769416', '2025-09-05 01:22:40.769416');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 37, 'ijcf3foxlvor', 'd22b7df8-e70f-4e54-87d8-4d39308fc0d0', false, '2025-08-10 00:48:21.626697+00', '2025-08-10 00:48:21.626697+00', NULL, '0947bfd4-46dc-46d8-ad08-bc4337932247');


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
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."companies" ("id", "name", "legal_name", "tax_id", "license_number", "address_line1", "address_line2", "city", "state", "zip_code", "country", "phone", "email", "website", "logo_url", "created_at", "updated_at") VALUES
	('7a80462a-79bd-4ada-b214-73ddb2ae7416', 'ContractorPro Demo', 'ContractorPro Demo LLC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'US', NULL, NULL, NULL, NULL, '2025-08-07 18:36:47.814154', '2025-08-07 18:36:47.814154'),
	('41dc31a4-b7aa-453b-b2e8-85f8b0e968a0', 'Casa C', 'casa-c-inc', '084883772', '61', '1741 Rowe Lodge', '151 Reinger Trace', 'Montreal', 'Quebec', 'J7W 5Y2', 'US', '5148889999', 'com@gmail.com', 'www.acem.com', NULL, '2025-08-08 02:24:08.868267', '2025-08-08 02:24:08.868267');


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."clients" ("id", "company_id", "first_name", "last_name", "email", "phone", "company_name", "address_line1", "address_line2", "city", "state", "zip_code", "country", "notes", "created_at", "updated_at", "type", "secondary_phone", "preferred_contact_method", "rating", "is_active") VALUES
	('6cbd9fc7-1ae0-486d-add2-985de60ca6af', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Michael', 'Taylor', 'michael@email.com', '555-1003', 'Taylor Construction', '789 Pine St', NULL, 'Springfield', 'IL', '62703', 'US', NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894', 'individual', NULL, 'email', 5, true),
	('737d07f3-7cce-43c9-8e63-77d68472c16b', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Emily', 'Davis', 'emily@email.com', '555-1002', 'Davis & Associates', '456 Oak Ave', NULL, 'Springfield', 'IL', '62702', 'US', NULL, '2025-08-07 18:44:28.351894', '2025-08-09 20:25:00.839136', 'individual', NULL, 'email', 4, true),
	('ff44f7cc-2ae5-473f-93bb-b9c867d64290', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Robert', 'Brown', 'robert@email.com', '555-1001', 'Brown Enterprises', '123 Main St', NULL, 'Springfield', 'IL', '62701', 'US', NULL, '2025-08-07 18:44:28.351894', '2025-08-09 20:25:03.972119', 'individual', NULL, 'email', 2, true),
	('080ba071-4822-4ad2-ae77-13fc8cf0b9bb', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Verona', 'Feil', 'your.email+fakedata90633@gmail.com', '560-179-9819', NULL, '870 Orion Heights', '81781 O''Conner Trail', 'Fort Wayne', 'NV', '67576-2802', 'US', '528', '2025-08-09 20:32:34.647637', '2025-08-09 20:32:34.647637', 'individual', '978-945-0857', 'email', 5, true),
	('76804a44-53e0-47ca-bb73-27887033b465', '41dc31a4-b7aa-453b-b2e8-85f8b0e968a0', 'Mike', 'Smile ', 'mike@gmail.com', '5142223366', NULL, '223 Sherbrooke ', NULL, 'Mtl', 'Quebec ', 'H7J7J', 'US', 'Mike is new', '2025-08-09 23:35:22.783228', '2025-08-09 23:35:22.783228', 'individual', NULL, 'email', 2, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "password_hash", "first_name", "last_name", "phone", "role", "is_active", "last_login", "created_at", "updated_at") VALUES
	('f6d28427-ffa0-4cbf-b9ce-deef5935fdf7', 'manager@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'Project', 'Manager', '555-0200', 'manager', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('1d1b54cd-2d39-46d1-b2c9-f38121ae26ff', 'john@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'John', 'Smith', '555-0301', 'employee', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('23e8d3e1-df10-440d-9b73-482474f0d335', 'sarah@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'Sarah', 'Johnson', '555-0302', 'employee', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('f83732e8-236f-4937-9797-32e86ae07abd', 'mike@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'Mike', 'Wilson', '555-0303', 'employee', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('ed9b0d7f-2078-4c1c-a017-26540e20e7ae', 'me@nickybruno.com', 'temp_hash_ed9b0d7f-2078-4c1c-a017-26540e20e7ae', '', '', NULL, 'admin', true, NULL, '2025-09-05 01:22:40.30431', '2025-09-05 01:22:40.30431'),
	('17f4cf87-5693-4167-a429-71020015288f', 'admin@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'System', 'Admin', '555-0100', 'admin', true, NULL, '2025-08-07 18:44:28.351894', '2025-09-05 01:23:48.202917'),
	('d22b7df8-e70f-4e54-87d8-4d39308fc0d0', 'nickybcotroni@gmail.com', 'temp_hash_d22b7df8-e70f-4e54-87d8-4d39308fc0d0', 'Nicky', 'Bruno', '4384700773', 'admin', true, NULL, '2025-08-08 02:12:19.37729', '2025-08-10 00:48:21.587048');


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employees" ("id", "user_id", "company_id", "employee_number", "hire_date", "termination_date", "job_title", "department", "hourly_rate", "salary", "pay_type", "emergency_contact_name", "emergency_contact_phone", "certifications", "skills", "notes", "is_active", "created_at", "updated_at") VALUES
	('13636604-3ccb-42db-a3ed-e9651719bc51', '1d1b54cd-2d39-46d1-b2c9-f38121ae26ff', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'EMP001', '2024-01-01', NULL, 'Senior Carpenter', 'Construction', 35.00, NULL, 'hourly', NULL, NULL, NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('9c38dc4d-0758-45ad-a394-6c4fc0d40a9c', '23e8d3e1-df10-440d-9b73-482474f0d335', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'EMP002', '2024-01-01', NULL, 'Electrician', 'Electrical', 40.00, NULL, 'hourly', NULL, NULL, NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('177cdda4-c0e6-42e3-8a04-a473cb9b85de', 'f83732e8-236f-4937-9797-32e86ae07abd', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'EMP003', '2024-01-01', NULL, 'Plumber', 'Plumbing', 38.00, NULL, 'hourly', NULL, NULL, NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: projects_new; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects_new" ("id", "company_id", "client_id", "project_number", "name", "description", "project_type", "status", "priority", "start_date", "estimated_end_date", "actual_end_date", "budget", "contract_amount", "site_address_line1", "site_address_line2", "site_city", "site_state", "site_zip_code", "site_lat", "site_lng", "project_manager_id", "notes", "created_at", "updated_at") VALUES
	('0420c15b-2dce-4537-a236-73462365c661', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'ff44f7cc-2ae5-473f-93bb-b9c867d64290', '514-666-8899', 'Brown Residence Renovation', 'Complete home renovation including kitchen and bathrooms', NULL, 'in_progress', 'high', '2025-01-15', '2025-04-15', '2025-07-08', 150000.00, 175000.00, '77 McGill', NULL, 'Montreal', 'Quebec', 'H7H 8J8', NULL, NULL, '13636604-3ccb-42db-a3ed-e9651719bc51', NULL, '2025-08-07 18:44:28.351894', '2025-08-21 21:29:30.013356'),
	('72444d6b-7272-4c2d-ba76-f7982e76aed7', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '737d07f3-7cce-43c9-8e63-77d68472c16b', '438-854-5522', 'Davis Office Building', 'New commercial office building construction', NULL, 'planning', 'high', '2025-03-01', '2025-09-01', '2025-09-01', 500000.00, 550000.00, '6767 Sherbrooke ', NULL, 'Montreal', 'Quebec', 'J8T 7T7', NULL, NULL, '13636604-3ccb-42db-a3ed-e9651719bc51', NULL, '2025-08-07 18:44:28.351894', '2025-08-21 21:30:14.334783'),
	('bc12d841-ebca-47a9-abcd-da4d2cd0215f', '41dc31a4-b7aa-453b-b2e8-85f8b0e968a0', '76804a44-53e0-47ca-bb73-27887033b465', '450-959-8822', 'Garage ', 'This is Mike’s first project ', NULL, 'in_progress', 'medium', '2025-08-09', '2025-08-16', NULL, 60400.00, NULL, '123 Main Street ', NULL, 'Montreal', 'Quebec', 'K0I9Y6', NULL, NULL, NULL, NULL, '2025-08-09 23:36:33.97373', '2025-08-21 21:31:41.147422'),
	('6c840f7f-260e-4fff-b2ca-18590e1be092', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '737d07f3-7cce-43c9-8e63-77d68472c16b', '514-965-6655', 'Henri Adams', 'Eaque accusamus omnis sunt tempore dolor quidem reiciendis repellendus vitae.', NULL, 'in_progress', 'medium', '2025-08-08', '2024-10-29', NULL, 335.00, NULL, '7805 Pfannerstill Cape', NULL, 'Montreal', 'Quebec', 'L0KI9I', NULL, NULL, NULL, NULL, '2025-08-09 03:49:48.706273', '2025-09-05 00:44:59.683222');


--
-- Data for Name: change_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: communications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."equipment" ("id", "company_id", "name", "category", "make", "model", "serial_number", "purchase_date", "purchase_price", "current_value", "last_maintenance_date", "next_maintenance_date", "maintenance_interval_days", "assigned_to", "current_project_id", "status", "condition", "location", "notes", "created_at", "updated_at") VALUES
	('4d60c495-768d-4958-b017-479216ff3725', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Excavator', 'Heavy Equipment', 'CAT', '320', NULL, '2024-01-01', 100000.00, 95000.00, NULL, NULL, NULL, NULL, NULL, 'available', 'good', NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('0ab85f2e-0bce-43dc-9a91-a2aab3ffef7e', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Pickup Truck', 'Vehicles', 'Ford', 'F-150', NULL, '2024-01-01', 45000.00, 42000.00, NULL, NULL, NULL, NULL, NULL, 'available', 'good', NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: financial_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."financial_transactions" ("id", "company_id", "project_id", "user_id", "transaction_date", "description", "category", "amount", "type", "attachment_file", "created_at", "updated_at") VALUES
	('114463f4-831b-4563-b2b0-24d49f3b99a5', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '6c840f7f-260e-4fff-b2ca-18590e1be092', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-01', 'Bathroom Remodel - Final Payment', 'Project Payment', 8500.00, 'income', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('3e19e56d-4758-401e-ad41-87268f7ab703', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '72444d6b-7272-4c2d-ba76-f7982e76aed7', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-13', 'Electrical Work - Johnson Electric', 'Subcontractor', -3200.00, 'expense', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('5c11764f-7317-4e64-95c9-ecdd4cd374bd', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '6c840f7f-260e-4fff-b2ca-18590e1be092', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-13', 'Lumber Supply - Home Depot', 'Materials', -2500.00, 'expense', 'home-depot-receipt.jpg', '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('7025268f-4ccc-4fca-981b-62fca9c8d0d6', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '72444d6b-7272-4c2d-ba76-f7982e76aed7', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-11', 'Tool Rental - United Rentals', 'Equipment', -450.00, 'expense', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('72dfffe1-0687-4f25-9550-8386d36d9696', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '0420c15b-2dce-4537-a236-73462365c661', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-10', 'Plumbing Supplies - Ferguson', 'Materials', -1200.00, 'expense', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('81ebe793-3647-45a9-bdfc-85b5a6e2bad9', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '0420c15b-2dce-4537-a236-73462365c661', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-15', 'Kitchen Renovation - Progress Payment', 'Project Payment', 15000.00, 'income', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('199f0443-6bdf-4fa6-ad52-e48e7aebd282', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '72444d6b-7272-4c2d-ba76-f7982e76aed7', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-22', 'retest', 'Project Payment', 2000.00, 'income', NULL, '2025-08-22 19:37:26.607798+00', '2025-08-22 19:37:26.607798+00'),
	('83074a5b-5222-4c51-96f7-bc1cfc00188a', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '72444d6b-7272-4c2d-ba76-f7982e76aed7', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-22', 'test', 'Transportation', -500.00, 'expense', NULL, '2025-08-22 19:36:46.984268+00', '2025-08-22 19:36:46.984268+00');


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."suppliers" ("id", "company_id", "name", "contact_name", "email", "phone", "address_line1", "address_line2", "city", "state", "zip_code", "country", "tax_id", "payment_terms", "notes", "created_at", "updated_at") VALUES
	('dcc2f30d-dcdc-4eb6-a2db-1482199afb01', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'ABC Building Supply', 'Tom Wilson', 'tom@abcsupply.com', '555-2001', '100 Supply Dr', NULL, 'Springfield', 'IL', '62704', 'US', NULL, NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('1eebf765-b35d-4451-8d91-5ddb824b0e5a', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'XYZ Tools & Equipment', 'Jane Anderson', 'jane@xyztools.com', '555-2002', '200 Industrial Pkwy', NULL, 'Springfield', 'IL', '62705', 'US', NULL, NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."materials" ("id", "company_id", "name", "category", "unit", "current_stock", "minimum_stock", "unit_cost", "supplier_id", "sku", "location", "notes", "is_active", "created_at", "updated_at") VALUES
	('c6302660-b2c7-475e-901b-3a0ebf55c374', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '2x4 Lumber', 'Construction', 'piece', 1000.000, 200.000, 3.99, 'dcc2f30d-dcdc-4eb6-a2db-1482199afb01', NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('ec7d8068-cd1f-4791-9a6e-4882238bf53e', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Drywall 4x8', 'Construction', 'sheet', 500.000, 100.000, 12.99, 'dcc2f30d-dcdc-4eb6-a2db-1482199afb01', NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('efa55ccd-d4ac-4fbf-bef4-c5ed69bc970d', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Electrical Wire 12/2', 'Electrical', 'foot', 5000.000, 1000.000, 0.89, '1eebf765-b35d-4451-8d91-5ddb824b0e5a', NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: material_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payroll; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects" ("id", "company_id", "name", "description", "status", "created_at", "updated_at") VALUES
	('b39904c9-b25b-4b7f-979f-ac7d23d27f85', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Brown Residence Renovation', 'Complete home renovation including kitchen and bathrooms', 'in_progress', '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('6a6d6047-81d8-4ec4-a9eb-6d759f0dd216', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Davis Office Building', 'New commercial office building construction', 'planning', '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tasks" ("id", "project_id", "parent_task_id", "name", "description", "status", "priority", "assigned_to", "estimated_hours", "actual_hours", "start_date", "due_date", "completion_date", "completion_percentage", "dependencies", "notes", "created_at", "updated_at") VALUES
	('d87a8751-6a59-4273-a4bf-553ad6ff142a', '0420c15b-2dce-4537-a236-73462365c661', NULL, 'Kitchen Demo', 'Remove existing kitchen cabinets and appliances', 'in_progress', 'high', '13636604-3ccb-42db-a3ed-e9651719bc51', 40.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('9870efec-588d-42da-9399-13133f8b13be', '0420c15b-2dce-4537-a236-73462365c661', NULL, 'Electrical Rough-in', 'Install new electrical wiring and outlets', 'not_started', 'high', '9c38dc4d-0758-45ad-a394-6c4fc0d40a9c', 30.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: time_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."time_tracking" ("id", "employee_id", "project_id", "clock_in", "clock_out", "break_duration", "total_hours", "overtime_hours", "hourly_rate", "location_lat", "location_lng", "notes", "status", "created_at", "updated_at") VALUES
	('c118fb71-2dfb-4906-be98-89fbda9586f8', '13636604-3ccb-42db-a3ed-e9651719bc51', 'b39904c9-b25b-4b7f-979f-ac7d23d27f85', '2024-01-15 08:00:00', '2024-01-15 16:00:00', 0, 8.00, 0.00, 35.00, NULL, NULL, NULL, 'completed', '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: user_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_companies" ("user_id", "company_id", "role") VALUES
	('d22b7df8-e70f-4e54-87d8-4d39308fc0d0', '41dc31a4-b7aa-453b-b2e8-85f8b0e968a0', 'admin'),
	('17f4cf87-5693-4167-a429-71020015288f', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'admin'),
	('f6d28427-ffa0-4cbf-b9ce-deef5935fdf7', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'manager'),
	('23e8d3e1-df10-440d-9b73-482474f0d335', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'employee'),
	('1d1b54cd-2d39-46d1-b2c9-f38121ae26ff', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'employee'),
	('f83732e8-236f-4937-9797-32e86ae07abd', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'employee');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 61, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
