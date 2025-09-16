const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const VideoTestimonial = require('../models/VideoTestimonial'); // <-- ADD THIS LINE

const Guest = require('../models/Guest');


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindy-munchs');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@demo.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin Demo',
        email: 'admin@demo.com',
        password: 'demo123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Create demo user
    const userExists = await User.findOne({ email: 'user@demo.com' });
    if (!userExists) {
      const user = new User({
        name: 'User Demo',
        email: 'user@demo.com',
        password: 'demo123',
        role: 'user'
      });
      await user.save();
      console.log('✅ Demo user created');
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedProducts = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log('✅ Products already exist, skipping seed');
      return;
    }

    const sampleProducts = [
      {
        name: 'Organic Quinoa',
        description: 'Premium quality organic quinoa, rich in protein and essential amino acids. Perfect for healthy meals and salads.',
        shortDescription: 'Premium organic quinoa rich in protein',
        price: 299,
        originalPrice: 349,
        category: 'superfoods',
        subcategory: 'grains',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
            alt: 'Organic Quinoa',
            isPrimary: true
          }
        ],
        stock: 50,
        sku: 'QUN001',
        weight: { value: 500, unit: 'g' },
        nutritionalInfo: {
          calories: 368,
          protein: 14.1,
          carbs: 64.2,
          fat: 6.1,
          fiber: 7.0
        },
        tags: ['organic', 'protein-rich', 'gluten-free'],
        isActive: true,
        isFeatured: true,
        isOrganic: true,
        ratings: { average: 4.5, count: 23 }
      },
      {
        name: 'Himalayan Pink Salt',
        description: 'Pure Himalayan pink salt, naturally mined and unprocessed. Rich in minerals and perfect for cooking.',
        shortDescription: 'Pure unprocessed Himalayan pink salt',
        price: 149,
        originalPrice: 199,
        category: 'spices',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500',
            alt: 'Himalayan Pink Salt',
            isPrimary: true
          }
        ],
        stock: 100,
        sku: 'HPS001',
        weight: { value: 1, unit: 'kg' },
        tags: ['natural', 'mineral-rich', 'pure'],
        isActive: true,
        isFeatured: true,
        ratings: { average: 4.7, count: 45 }
      },
      {
        name: 'Cold Pressed Coconut Oil',
        description: 'Virgin coconut oil extracted through cold pressing method. Retains all natural nutrients and flavor.',
        shortDescription: 'Virgin cold pressed coconut oil',
        price: 399,
        originalPrice: 449,
        category: 'oils',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
            alt: 'Coconut Oil',
            isPrimary: true
          }
        ],
        stock: 30,
        sku: 'CCO001',
        weight: { value: 500, unit: 'ml' },
        tags: ['virgin', 'cold-pressed', 'natural'],
        isActive: true,
        isFeatured: true,
        ratings: { average: 4.6, count: 67 }
      },
      {
        name: 'Organic Chia Seeds',
        description: 'Nutrient-dense organic chia seeds packed with omega-3 fatty acids, fiber, and protein.',
        shortDescription: 'Omega-3 rich organic chia seeds',
        price: 249,
        category: 'superfoods',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=500',
            alt: 'Chia Seeds',
            isPrimary: true
          }
        ],
        stock: 75,
        sku: 'CHS001',
        weight: { value: 250, unit: 'g' },
        nutritionalInfo: {
          calories: 486,
          protein: 16.5,
          carbs: 42.1,
          fat: 30.7,
          fiber: 34.4
        },
        tags: ['organic', 'omega-3', 'superfood'],
        isActive: true,
        isOrganic: true,
        ratings: { average: 4.4, count: 34 }
      },
      {
        name: 'Turmeric Powder',
        description: 'Pure turmeric powder with high curcumin content. Known for its anti-inflammatory properties.',
        shortDescription: 'Pure turmeric powder with curcumin',
        price: 89,
        category: 'spices',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500',
            alt: 'Turmeric Powder',
            isPrimary: true
          }
        ],
        stock: 120,
        sku: 'TUR001',
        weight: { value: 100, unit: 'g' },
        tags: ['anti-inflammatory', 'curcumin', 'ayurvedic'],
        isActive: true,
        ratings: { average: 4.8, count: 89 }
      },
      {
        name: 'Mixed Nuts Trail Mix',
        description: 'Healthy mix of almonds, walnuts, cashews, and dried fruits. Perfect for snacking.',
        shortDescription: 'Healthy mixed nuts and dried fruits',
        price: 199,
        category: 'snacks',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500',
            alt: 'Trail Mix',
            isPrimary: true
          }
        ],
        stock: 60,
        sku: 'TMX001',
        weight: { value: 200, unit: 'g' },
        tags: ['healthy-snack', 'protein', 'energy'],
        isActive: true,
        ratings: { average: 4.3, count: 56 }
      },
      {
        name: 'Green Tea',
        description: 'Premium green tea leaves rich in antioxidants. Refreshing and healthy beverage option.',
        shortDescription: 'Antioxidant-rich premium green tea',
        price: 179,
        category: 'beverages',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
            alt: 'Green Tea',
            isPrimary: true
          }
        ],
        stock: 80,
        sku: 'GRT001',
        weight: { value: 100, unit: 'g' },
        tags: ['antioxidant', 'healthy', 'refreshing'],
        isActive: true,
        ratings: { average: 4.5, count: 78 }
      },
      {
        name: 'Organic Brown Rice',
        description: 'Whole grain organic brown rice, rich in fiber and nutrients. A healthy alternative to white rice.',
        shortDescription: 'Fiber-rich organic brown rice',
        price: 159,
        category: 'grains',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
            alt: 'Brown Rice',
            isPrimary: true
          }
        ],
        stock: 90,
        sku: 'BRR001',
        weight: { value: 1, unit: 'kg' },
        tags: ['organic', 'whole-grain', 'fiber-rich'],
        isActive: true,
        isOrganic: true,
        ratings: { average: 4.2, count: 42 }
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products created');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

const seedGuests = async () => {
  try {
    const guestCount = await Guest.countDocuments();
    if (guestCount > 0) {
      console.log('✅ Guests already exist, skipping seed');
      return;
    }

    const sampleGuests = [
      { name: 'John Doe', email: 'johndoe@example.com', newsletterSubscribed: true },
      { email: 'guest@example.com', newsletterSubscribed: true }
    ];

    await Guest.insertMany(sampleGuests);
    console.log('✅ Sample guests created');
  } catch (error) {
    console.error('❌ Error seeding guests:', error);
  }
};

// New function to seed video testimonials
const seedVideoTestimonials = async () => {
  try {
    const testimonialCount = await VideoTestimonial.countDocuments();
    if (testimonialCount > 0) {
      console.log('✅ Video testimonials already exist, skipping seed');
      return;
    }

    const sampleVideoTestimonials = [
      {
        name: "Rajesh Patel",
        location: "Mumbai, Maharashtra",
        title: "Health Enthusiast & Father",
        videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=710&fit-crop",
        fullQuote: "I was introduced to Mindy Munchs through a friend and I'm so glad I discovered these amazing traditional snacks. My whole family loves them!",
        rating: 5,
        duration: "2:15"
      },
      {
        name: "Priya Sharma",
        location: "Delhi, India",
        title: "Working Mother",
        videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=710&fit-crop",
        fullQuote: "When my son told me that no other snacks taste as good as Mindy Munchs, I knew we had found something special. Perfect for our family!",
        rating: 5,
        duration: "1:45"
      },
      {
        name: "Anita Gupta",
        location: "Bangalore, Karnataka",
        title: "Fitness Coach",
        videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=710&fit-crop",
        fullQuote: "These traditional superfoods have transformed my client's snacking habits completely. I recommend Mindy Munchs to all my fitness clients!",
        rating: 5,
        duration: "1:30"
      },
      {
        name: "Amit Kumar",
        location: "Chennai, Tamil Nadu",
        title: "Software Engineer",
        videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=710&fit-crop",
        fullQuote: "Working from home, I needed healthy snacks that wouldn't make me feel sluggish. Mindy Munchs has been a game-changer for my productivity!",
        rating: 5,
        duration: "2:00"
      },
      {
        name: "Meera Joshi",
        location: "Pune, Maharashtra",
        title: "Nutritionist",
        videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=710&fit-crop",
        fullQuote: "As a nutritionist, I recommend Mindy Munchs to all my clients. These traditional superfoods are packed with nutrients and taste amazing!",
        rating: 5,
        duration: "1:50"
      },
      {
        name: "Karan Singh",
        location: "Jaipur, Rajasthan",
        title: "College Student",
        videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=710&fit-crop",
        fullQuote: "Perfect snacks for study sessions! Keeps me energized without the sugar crash. My hostel friends are all obsessed now!",
        rating: 5,
        duration: "1:25"
      }
    ];
    
    await VideoTestimonial.insertMany(sampleVideoTestimonials);
    console.log('✅ Sample video testimonials created');
  } catch (error) {
    console.error('❌ Error seeding video testimonials:', error);
  }
};


const seedData = async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedProducts();
    await seedGuests();

    await seedVideoTestimonials(); // <-- ADD THIS LINE

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}


module.exports = { seedData, seedUsers, seedProducts, seedVideoTestimonials, seedGuests };