import { Vehicle } from "./types";

export const INITIAL_INVENTORY: Vehicle[] = [
  {
    id: "venom-f5",
    make: "Hennessey",
    model: "Venom F5",
    year: 2024,
    price: 2100000,
    topSpeed: 500,
    acceleration: 2.6,
    horsepower: 1817,
    transmission: "7-SPD SINGLE CLUTCH",
    engine: "6.6L TWIN-TURBO V8",
    torque: "1,193 LB-FT",
    weight: "2,998 LBS",
    downforce: "900 LBS @ 250 MPH",
    fuelDelivery: "PORT INJECTION",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000",
    category: "Hypercars",
    status: "available",
    isFeatured: true,
    description: "The Hennessey Venom F5 is a high-performance sports car manufactured by the American vehicle-manufacturing company Hennessey Special Vehicles.",
    features: ["Carbon Fiber Monocoque", "Active Aero", "Bespoke Interior"],
    exteriorColor: "Venom Yellow",
    interiorColor: "Black Alcantara",
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  {
    id: "jesko-absolut",
    make: "Koenigsegg",
    model: "Jesko Absolut",
    year: 2025,
    price: 3400000,
    topSpeed: 531,
    acceleration: 2.5,
    horsepower: 1600,
    transmission: "9-SPD LST",
    engine: "5.0L TWIN-TURBO V8",
    torque: "1,106 LB-FT",
    weight: "3,064 LBS",
    downforce: "330 LBS @ MAX SPEED",
    fuelDelivery: "DIRECT INJECTION",
    imageUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000",
    category: "Hypercars",
    status: "pre-order",
    isFeatured: true,
    description: "The Jesko Absolut is the fastest Koenigsegg ever made and the company will never endeavor to make a faster street-legal series production car.",
    features: ["Light Speed Transmission", "Carbon Fiber Wheels", "Ghost Mode"],
    exteriorColor: "Graphite Grey",
    interiorColor: "Desaturated Orange",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  {
    id: "valkyrie",
    make: "Aston Martin",
    model: "Valkyrie",
    year: 2023,
    price: 3200000,
    topSpeed: 402,
    acceleration: 2.5,
    horsepower: 1160,
    transmission: "7-SPD SINGLE CLUTCH",
    engine: "6.5L V12 HYBRID",
    torque: "664 LB-FT",
    weight: "2,271 LBS",
    downforce: "4,000 LBS @ 155 MPH",
    fuelDelivery: "DIRECT INJECTION",
    imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1000",
    category: "Hypercars",
    status: "sold",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1542362567-b055002b91f4?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1000"
    ]
  }
];
