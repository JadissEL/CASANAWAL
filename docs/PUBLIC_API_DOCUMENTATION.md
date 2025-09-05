# 🌐 CasaNawal Public API Documentation

## Enterprise-Level REST API for Restaurant Website

### 🔗 Base URL
```
https://your-domain.com/api/public
```

---

## 📋 **Table of Contents**
1. [Menu & Products API](#menu--products-api)
2. [Orders API](#orders-api)
3. [Customer API](#customer-api)
4. [Utilities API](#utilities-api)
5. [Response Format](#response-format)
6. [Error Handling](#error-handling)

---

## 🍽️ **Menu & Products API**

### **GET** `/menu`
Get complete menu with advanced filtering and analytics tracking.

**Query Parameters:**
- `category` (string): Filter by category slug or 'featured'
- `search` (string): Search in product names and descriptions
- `is_vegetarian` (boolean): Filter vegetarian products
- `is_spicy` (boolean): Filter spicy products
- `min_price` (number): Minimum price filter
- `max_price` (number): Maximum price filter
- `sort_by` (string): `sort_order`, `price_asc`, `price_desc`, `rating`, `popular`, `newest`
- `sort_order` (string): `ASC` or `DESC`
- `language` (string): `fr` or `ar` (default: `fr`)
- `featured_only` (boolean): Show only featured products
- `limit` (number): Results per page (default: 50)
- `offset` (number): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Tajine Poulet aux Olives",
        "description": "Délicieux tajine traditionnel...",
        "base_price": 45.00,
        "rating": 4.8,
        "rating_count": 156,
        "prep_time_minutes": 30,
        "is_vegetarian": false,
        "is_spicy": false,
        "is_featured": true,
        "category_name": "Tajines",
        "category_slug": "tajines",
        "main_image": "url",
        "images": [...],
        "allergens": [...],
        "portion_pricing": [
          {
            "persons": 2,
            "discount_percentage": 0,
            "size_label_fr": "Pour 2 personnes",
            "final_price": 90.00
          }
        ]
      }
    ],
    "categories": [...],
    "pagination": {
      "current_page": 1,
      "per_page": 50,
      "total": 127,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    },
    "filters": {...}
  }
}
```

### **GET** `/menu/stats`
Get menu statistics for homepage display.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_products": 127,
      "total_categories": 8,
      "vegetarian_count": 45,
      "featured_count": 12,
      "average_rating": 4.6,
      "total_reviews": 1247
    },
    "featured_products": [...]
  }
}
```

### **GET** `/menu/search`
Get search suggestions for autocomplete.

**Query Parameters:**
- `q` (string): Search query (minimum 2 characters)
- `language` (string): Language code (default: `fr`)
- `limit` (number): Max suggestions (default: 5)

### **GET** `/products/:id`
Get detailed product information with recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Tajine Poulet aux Olives",
      "description": "...",
      "base_price": 45.00,
      "rating": 4.8,
      "images": [...],
      "allergens": [...],
      "portion_pricing": [...],
      "reviews": [
        {
          "id": "uuid",
          "rating": 5,
          "comment": "Excellent!",
          "created_at": "2025-01-15T...",
          "client_name": "Ahmed B."
        }
      ]
    },
    "related_products": [...]
  }
}
```

---

## 📦 **Orders API**

### **POST** `/orders`
Create a new order with comprehensive validation.

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "portion_persons": 2
    }
  ],
  "client_info": {
    "phone": "+212600123456",
    "email": "client@example.com",
    "first_name": "Ahmed",
    "last_name": "Bennani"
  },
  "delivery_info": {
    "address": "123 Rue Mohammed V, Casablanca",
    "date": "2025-01-20",
    "slot": "dinner",
    "zone": "centre-ville"
  },
  "payment_info": {
    "method": "bank_transfer"
  },
  "promo_code": "WELCOME10",
  "notes": "Extra épices s'il vous plaît"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "reference": "NAW-20250120-ABC123",
      "status": "pending_deposit",
      "subtotal": 180.00,
      "discount_amount": 18.00,
      "delivery_fee": 15.00,
      "total_amount": 177.00,
      "deposit_required": 88.50,
      "delivery_date": "2025-01-20",
      "delivery_slot": "dinner",
      "items": [...]
    },
    "payment_info": {
      "deposit_amount": 88.50,
      "total_amount": 177.00,
      "payment_methods": ["bank_transfer", "cash_deposit", "card"]
    }
  }
}
```

### **GET** `/orders/:reference`
Get order details and status.

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "reference": "NAW-20250120-ABC123",
      "status": "confirmed",
      "total_amount": 177.00,
      "total_paid": 88.50,
      "remaining_balance": 88.50,
      "items": [...],
      "payments": [...],
      "status_history": [
        {
          "status": "pending_deposit",
          "comment": "Order created and awaiting deposit",
          "changed_at": "2025-01-20T10:30:00Z"
        },
        {
          "status": "confirmed",
          "comment": "Deposit verified and order confirmed",
          "changed_at": "2025-01-20T11:15:00Z"
        }
      ]
    }
  }
}
```

### **POST** `/orders/:order_reference/payment`
Submit payment proof for order.

**Request Body:**
```json
{
  "payment_method": "bank_transfer",
  "amount": 88.50,
  "transaction_reference": "TXN123456789",
  "proof_file_url": "https://...",
  "notes": "Virement effectué depuis Attijariwafa Bank"
}
```

### **PUT** `/orders/:reference/cancel`
Cancel an order (if cancellable).

**Request Body:**
```json
{
  "reason": "Change de plans"
}
```

---

## 👤 **Customer API**

### **GET** `/customers/:phone/profile`
Get comprehensive customer profile with analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "phone": "+212600123456",
      "email": "ahmed@example.com",
      "first_name": "Ahmed",
      "last_name": "Bennani",
      "total_orders": 15,
      "total_spent": 2850.50,
      "preferences": {}
    },
    "analytics": {
      "segment": "vip",
      "lifetime_value": 2850.50,
      "avg_order_value": 190.03,
      "order_frequency": 2.5,
      "churn_risk_score": 0.15,
      "satisfaction_score": 4.7,
      "favorite_category": {
        "id": "uuid",
        "name": "Tajines"
      },
      "preferred_delivery_zones": ["centre-ville"],
      "preferred_order_times": {
        "weekday": [19, 20],
        "weekend": [12, 13, 19, 20]
      }
    },
    "recent_orders": [...],
    "favorite_products": [...],
    "delivery_stats": [...]
  }
}
```

### **PUT** `/customers/:phone/profile`
Update customer profile information.

### **GET** `/customers/:phone/orders`
Get customer order history with pagination.

### **POST** `/customers/:phone/reviews`
Add product review from customer.

**Request Body:**
```json
{
  "product_id": "uuid",
  "order_id": "uuid",
  "rating": 5,
  "comment": "Délicieux tajine, parfaitement épicé!"
}
```

### **GET** `/customers/:phone/recommendations`
Get personalized product recommendations.

**Query Parameters:**
- `limit` (number): Max recommendations (default: 6)

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "uuid",
        "name": "Couscous Royal",
        "base_price": 55.00,
        "rating": 4.7,
        "reason": "favorite_category",
        "main_image": "url"
      }
    ],
    "strategies_used": ["favorite_category", "collaborative", "popular"]
  }
}
```

### **GET** `/customers/:phone/loyalty`
Get customer loyalty status and benefits.

**Response:**
```json
{
  "success": true,
  "data": {
    "loyalty_info": {
      "points": 285,
      "tier": "gold",
      "total_spent": 2850.50,
      "amount_to_next_tier": 2149.50,
      "satisfaction_score": 4.7
    },
    "benefits": {
      "discount": 15,
      "free_delivery_threshold": 100,
      "priority_support": true,
      "exclusive_offers": true
    },
    "tier_progression": {...}
  }
}
```

---

## 🛠️ **Utilities API**

### **GET** `/settings`
Get public restaurant settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "restaurant_name": "CasaNawal",
    "restaurant_phone": "+212 5XX-XXXXXX",
    "opening_hours": {
      "monday": { "open": "11:00", "close": "22:00", "closed": false }
    },
    "delivery_zones": [...],
    "minimum_order_amount": 50,
    "payment_methods": ["bank_transfer", "cash_deposit", "card"]
  }
}
```

### **GET** `/delivery/zones`
Get delivery zones with pricing and estimated times.

**Response:**
```json
{
  "success": true,
  "data": {
    "zones": [
      {
        "id": "centre-ville",
        "name": "Centre-ville",
        "fee": 10,
        "min_order": 80,
        "estimated_time": "25-35 min",
        "coverage_areas": ["Maarif", "Gauthier", "Palmier"],
        "success_rate": 0.97,
        "recent_orders": 45
      }
    ],
    "default_fee": 15,
    "free_delivery_threshold": 200
  }
}
```

### **GET** `/delivery/timeslots`
Get available delivery time slots.

**Query Parameters:**
- `date` (string): Delivery date (YYYY-MM-DD)
- `zone` (string): Delivery zone (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-20",
    "zone": "centre-ville",
    "slots": [
      {
        "id": "lunch",
        "label": "12:30 - 14:00",
        "capacity": 25,
        "available": true,
        "current_orders": 8,
        "remaining_capacity": 17,
        "status": "available"
      }
    ],
    "total_capacity": 135,
    "total_booked": 47
  }
}
```

### **POST** `/promo/validate`
Validate promo code.

**Request Body:**
```json
{
  "code": "WELCOME10",
  "order_total": 150.00,
  "customer_phone": "+212600123456"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "promo_code": {
    "id": "uuid",
    "code": "WELCOME10",
    "name_fr": "Bienvenue 10%",
    "type": "percentage",
    "value": 10,
    "discount_amount": 15.00,
    "description": "10% de réduction",
    "valid_until": "2025-02-28",
    "remaining_uses": 45
  }
}
```

### **GET** `/contact`
Get restaurant contact information and current status.

**Response:**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "name": "CasaNawal",
      "description": "Cuisine marocaine authentique et moderne",
      "phone": "+212 5XX-XXXXXX",
      "email": "contact@casanawal.ma",
      "address": "123 Boulevard Mohammed V, Casablanca, Maroc"
    },
    "business_hours": {
      "hours": {...},
      "currently_open": true,
      "next_open_time": null,
      "timezone": "Africa/Casablanca"
    },
    "ratings": {
      "overall": "4.6",
      "food_quality": "4.8",
      "delivery": "4.4",
      "service": "4.5",
      "recommendation_rate": "94"
    }
  }
}
```

### **POST** `/analytics/track`
Track user activity for analytics.

**Request Body:**
```json
{
  "event_type": "product_view",
  "page": "/menu/tajines",
  "product_id": "uuid",
  "category": "tajines",
  "search_query": null,
  "user_agent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

---

## 📄 **Response Format**

All API responses follow this consistent format:

### **Success Response:**
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### **Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## ⚠️ **Error Handling**

### **HTTP Status Codes:**
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### **Common Error Messages:**
- `"Product not found"` - Product doesn't exist or is inactive
- `"Order not found"` - Order reference is invalid
- `"Customer not found"` - Phone number not in system
- `"Invalid date. Please select a date within the next 7 days."` - Invalid delivery date
- `"Code promo invalide ou expiré"` - Promo code validation failed

---

## 🚀 **Performance Features**

### **Analytics Integration:**
- Automatic view tracking for products
- Real-time metrics updates
- Customer behavior analysis
- Inventory impact tracking

### **Caching & Optimization:**
- Optimized database queries with indexes
- Aggregated analytics tables for fast reporting
- Efficient pagination with offset/limit
- Real-time metrics without heavy computation

### **Smart Recommendations:**
- Collaborative filtering algorithm
- Category-based suggestions
- Purchase history analysis
- Popularity-based fallbacks

---

## 🔐 **Security Features**

### **Data Validation:**
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- Rate limiting ready

### **Business Logic:**
- Inventory reservation system
- Order status validation
- Payment verification workflow
- Automatic cleanup procedures

---

## 📊 **Business Intelligence**

### **Automated Tracking:**
- Customer segmentation (New, Regular, VIP, At-Risk)
- Product performance analytics
- Delivery zone optimization
- Seasonal trend analysis

### **Real-time Metrics:**
- Live order counts
- Revenue tracking
- Customer satisfaction scores
- Inventory alerts

---

**🎯 This API powers a complete restaurant ecosystem with enterprise-level features, real-time analytics, and intelligent customer engagement!**
