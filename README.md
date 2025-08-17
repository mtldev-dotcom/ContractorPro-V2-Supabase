# **ContractorPro V2 – Supabase Edition**

A modern contractor management platform built with Next.js 13+, TypeScript, Tailwind CSS and Supabase.  This version of ContractorPro focuses on integrating Supabase for authentication, data storage and server‑side rendering (SSR).  It currently implements project listing and management features and provides a solid foundation for expanding into a full business management suite.

## **Table of Contents**

* Overview

* Features

* Tech Stack

* Project Structure

* Prerequisites

* Installation

* Environment Configuration

* Running the App

* Developer Guidelines

* Contributing

## **Overview**

ContractorPro V2 is designed to help general contractors track projects, clients, employees and finances.  This version uses Supabase for its backend, leveraging PostgreSQL, authentication and row‑level security.  The frontend is built using the Next.js app router to enable server components, client components and middleware for session handling.  The UI layer is powered by Tailwind CSS and a small component library (shadcn/ui).

## **Features**

* Project Dashboard – lists projects with search, status filtering, pagination and cards showing budget, contract amount, progress and key contacts.  Projects can be created, edited, archived or deleted via modals.

* Supabase Authentication – user sessions are managed via Supabase auth.  Middleware refreshes the session on each request and redirects unauthenticated users to the login page .

* Multi‑tenant Support – users belong to companies and only see data associated with their company (enforced via row‑level security and hooks such as useOnboarding ).

* Reusable Hooks and Components – custom hooks encapsulate Supabase queries (e.g., useProjects ), and UI components (cards, buttons, toasts) promote consistency.

## **Tech Stack**

* Next.js 13+ (App Router) – React framework with support for server and client components, middleware and server actions.

* TypeScript – type safety across the entire codebase.

* Tailwind CSS – utility‑first styling with a custom component library (shadcn/ui).

* Supabase – Postgres database, authentication and storage; clients instantiated via @supabase/ssr for SSR support .

* Lucide React – icon library used throughout the interface.

## **Project Structure**

Below is a simplified overview of the key directories and files in this repository:

