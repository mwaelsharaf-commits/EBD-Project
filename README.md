# Forsa

**Course:** Electronic Business Development (BINF 503) · Winter 2026
**Instructor:** Dr. Nourhan Hamdi
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Mariam Sharafeldin | 16003172 | T6 | mwaelsharaf-commits |
| Joumana Khalifa |    16001343 | T1 | joumanakhalifa1705-oss|
| Ranim Ahmed |        16003255 | T6 | ranim-ahmed |
| Rauan Mahmoud |      16003873 | T6 | rauanmahmoudd-prog|
| Elena Roger |        ⁠1600775 | T1 | elenacharouty-arch |

## 2. The idea

The Unbooked is a marketplace for unused business capacity: empty appointments, tables, class spots and sessions. Service businesses such as salons, restaurants, photographers and fitness studios often have slots that stay unbooked, and every empty slot is revenue they never get back. On The Unbooked, a business publishes these slots at a discount, and customers browse and book them for less. Businesses recover revenue they would otherwise lose, and customers get the services they want at a lower price.

## 3. Features

### 3.1 The full product

- Registration and login with two roles: customer and business
- Businesses publish empty slots with an original price, a discounted price and a number of spots
- Businesses edit or delete their slots
- Customers browse upcoming deals and see how long until each one starts
- A live countdown timer on each deal
- Customers book a slot and choose how many spots they want
- Customers change the number of spots in a booking, or cancel it
- Business dashboard showing recovered revenue and the bookings on each slot
- Filter deals by category (beauty, food, fitness, photography) and by date
- Customer reviews and ratings of businesses after a booking
- Online payment when booking
- Map view of deals near the customer
- Notifications when a favourite business posts a new deal
- Automatic price drop as a slot's start time gets closer
- Admin panel to verify new businesses

### 3.2 The use cases we will build

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with name, email, password and role (customer or business; a business also enters its business name); logs in with email and password | Their home page with their name in the header: customers see the deals, businesses see their dashboard. A wrong password shows an error, and pages that need a user redirect to the login page | A User, with the password hashed and the role |
| 2 | A business publishes an empty slot | Fills in a form: service name, category, description, date and time, duration, original price, discounted price and number of spots | The new slot in "My slots" on their dashboard, with spots left and the revenue recovered so far (spots booked × discounted price). An error if the discounted price is not lower than the original price | A new Slot linked to the business, with spotsLeft equal to the number of spots |
| 3 | A business edits or deletes a slot | In "My slots", clicks Edit to change the service name, description, date and time or discounted price, or clicks Delete | The updated slot, or the slot removed from the list. An error if they try to delete a slot that already has bookings | The Slot is updated or deleted. Only the business that created it can change it |
| 4 | A customer books a slot | Browses the deals, opens one, chooses how many spots and clicks Book | Each deal's original and discounted price, spots left and how long until it starts. After booking, the booking in "My bookings" with its total price. An error if not enough spots are left | A new Booking linking the customer and the slot, with the spots and total price. The Slot's spotsLeft goes down by the spots booked |
| 5 | A customer changes or cancels a booking | In "My bookings", changes the number of spots in a booking, or clicks Cancel | The booking with its new spots and total price, or the booking removed from the list. An error if not enough spots are left | The Booking is updated or deleted, and the Slot's spotsLeft is adjusted: spots are given back when the customer books fewer or cancels. Only the customer who made the booking can change it |

## 4. Who owns what

| Member | Use case |
|---|---|
| Elena Roger | 1. Registration and login |
| Mariam Sharafeldin | 2. A business publishes an empty slot |
| Joumana Khalifa | 3. A business edits or deletes a slot |
| Rauan Mahmoud | 4. A customer books a slot |
| Ranim Ahmed | 5. A customer changes or cancels a booking |

## 5. Data model

### User

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  role: { type: String, required: true }, // "customer" or "business"
  businessName: { type: String }, // only for businesses
});
```

### Slot

```js
const slotSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the business that published it
  serviceName: { type: String, required: true },
  category: { type: String }, // e.g. "beauty", "food", "fitness", "photography"
  description: { type: String },
  startTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  dealPrice: { type: Number, required: true },
  totalSpots: { type: Number, required: true },
  spotsLeft: { type: Number, required: true },
});
```

### Booking

```js
const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the customer who booked
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true }, // the slot they booked
  spots: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // spots × the slot's dealPrice
});
```

## 6. Run it locally

> Leave this section as it is until Submission 2 (Thursday 10 December 2026,
> 23:59). Then fill it in: we follow these steps to run your project.

### Back end

```bash
cd backend
npm install
# create backend/.env from backend/.env.example (see the table below)
npm start
```

The API runs on http://localhost:3000.

| Variable in `.env` | What it is |
|---|---|
| `MONGODB_URI` | The connection string of your MongoDB Atlas database |
| `JWT_SECRET` | Any long random text, used to sign login tokens |
| [Any other variable] | [What it is] |

### Front end

```bash
cd frontend
npm install
npm run dev
```

The app runs on [the address `npm run dev` prints, e.g. http://localhost:5173].