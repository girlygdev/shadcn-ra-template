# Architecture Overview


## Context

The **Reset Clinic API** is the backend service that powers the administrative functions of the Reste Clinic platform. Its primary purpose is to provide a secure interface for managing core entities such as users, coaches, assessments, bookings, payments, and notifications.

This service sits between the client-facing applications (admin dashboard, customer portal) and the underlying persistence and integration layers (database, PayMongo, SimplyBook). It is responsible for enforcing business rules and exposing management-level operations through a controlled API surface.

Key constraints and goals include:
- **Security first**: Role-based access control (RBAC) to restrict admin endpoints, JWT auth with short-lived tokens, and strict input validation.
- **Auditability**: All admin actions (CRUD, settings changes, payments, notifications) must be logged to support compliance and traceability.
- **Scalability**: Must support growing numbers of coaches, students, parents, and general clients without major refactors.
- **Integration-ready**: Acts as the point of coordination for third-party services (PayMongo for payments, SimplyBook for scheduling).
- **Observability**: Centralized logging, metrics, and error tracking to support monitoring and on-call operations.

The Admin API therefore provides the foundation for internal workflows: onboarding coaches, configuring system-wide settings, overseeing assessment pipelines, tracking bookings, and resolving payment or notification issues.


## System Diagram
- Frontend: React app calls backend via REST.
- Backend: Node/Express with modular routes.
- Persistence: MongoDB via Mongoose.
- Async: Webhooks from PayMongo and SimplyBook.me


## Modules
- Users: auth, roles (client. coach. admin)
- Profiles: user metadata and visibility rules (client.profile coach.profile)
- Assessments: results. history
- Bookings: scheduling integration, availability, confirmations
- Payments: PayMongo integration and webhooks
- Notifications: email. transactional templates
- Admin: dashboards and audit logs


## Data Flow
1. Client authenticates and receives JWT.
2. Client requests assessment. 
3. Payment intent created. webhook updates status. server adds session credits
4. Client takes assessment. View results and/or update profile.
5. Option to book coaching session.
6. Select coach. Book session.
7. Payment intent created. webhook updates status. credits session to client.
8. Select booking appointment. send appointment via SimplyBook.me webhook.
9. Booking confirmed via SimplyBook webhook
10. Notify client and coach 24H and 2H before appointment.


## Security
- JWT expiration and refresh.
- Role based access control.
- Input validation and rate limiting.


## Observability
- Logging:
- Metrics: 
- Error tracking: Sentry.