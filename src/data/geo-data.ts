// Comprehensive trade location recommendation database
// Recommends States/Provinces, Commercial Cities & Ports, and Postal Code guidelines based on selected Country

export interface StateGeoInfo {
  name: string;
  cities: string[];
}

export interface CountryGeoConfig {
  pincodeLabel: string;
  pincodePlaceholder: string;
  pincodeHint?: string;
  states: StateGeoInfo[];
}

export const COUNTRY_GEO_DATA: Record<string, CountryGeoConfig> = {
  India: {
    pincodeLabel: "PIN Code *",
    pincodePlaceholder: "e.g. 363641",
    pincodeHint: "6-digit Indian Postal Code",
    states: [
      {
        name: "Gujarat",
        cities: ["Morbi", "Kandla Port", "Mundra Port", "Ahmedabad", "Surat", "Rajkot", "Vadodara", "Jamnagar", "Bhavnagar", "Gandhidham"],
      },
      {
        name: "Maharashtra",
        cities: ["Mumbai", "JNPT (Nhava Sheva)", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"],
      },
      {
        name: "Delhi NCR",
        cities: ["New Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad"],
      },
      {
        name: "Tamil Nadu",
        cities: ["Chennai", "V.O. Chidambaranar (Tuticorin) Port", "Coimbatore", "Madurai", "Tiruppur", "Salem"],
      },
      {
        name: "Karnataka",
        cities: ["Bengaluru", "New Mangalore Port", "Mysuru", "Hubballi", "Belagavi"],
      },
      {
        name: "Andhra Pradesh",
        cities: ["Visakhapatnam Port", "Kakinada Port", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
      },
      {
        name: "Telangana",
        cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
      },
      {
        name: "Rajasthan",
        cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Bhilwara", "Alwar"],
      },
      {
        name: "Punjab",
        cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
      },
      {
        name: "West Bengal",
        cities: ["Kolkata Port", "Haldia Port", "Siliguri", "Howrah", "Asansol"],
      },
      {
        name: "Kerala",
        cities: ["Cochin (Kochi) Port", "Thiruvananthapuram", "Kozhikode", "Kollam"],
      },
      {
        name: "Uttar Pradesh",
        cities: ["Kanpur", "Lucknow", "Varanasi", "Agra", "Noida", "Meerut", "Prayagraj"],
      },
      {
        name: "Madhya Pradesh",
        cities: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
      },
      {
        name: "Haryana",
        cities: ["Gurugram", "Faridabad", "Panipat", "Karnal", "Ambala"],
      },
      {
        name: "Odisha",
        cities: ["Paradip Port", "Bhubaneswar", "Cuttack", "Rourkela", "Dhamra Port"],
      },
      {
        name: "Goa",
        cities: ["Mormugao Port", "Panaji", "Margao", "Vasco da Gama"],
      },
    ],
  },

  "United States": {
    pincodeLabel: "ZIP Code *",
    pincodePlaceholder: "e.g. 90001",
    pincodeHint: "5-digit US ZIP Code",
    states: [
      {
        name: "California",
        cities: ["Port of Los Angeles", "Port of Long Beach", "San Francisco", "Oakland Port", "San Diego", "San Jose", "Sacramento"],
      },
      {
        name: "New York",
        cities: ["New York City", "Port of New York & New Jersey", "Buffalo", "Rochester", "Albany"],
      },
      {
        name: "Texas",
        cities: ["Houston Port", "Dallas", "Fort Worth", "Austin", "San Antonio", "Corpus Christi Port", "El Paso"],
      },
      {
        name: "Florida",
        cities: ["PortMiami", "Port Everglades (Fort Lauderdale)", "Tampa Port", "Jacksonville Port", "Orlando"],
      },
      {
        name: "Illinois",
        cities: ["Chicago", "Port of Chicago", "Naperville", "Rockford", "Peoria"],
      },
      {
        name: "New Jersey",
        cities: ["Newark", "Jersey City", "Elizabeth Port", "Paterson", "Edison"],
      },
      {
        name: "Washington",
        cities: ["Seattle Port", "Tacoma Port", "Spokane", "Vancouver", "Bellevue"],
      },
      {
        name: "Georgia",
        cities: ["Port of Savannah", "Atlanta", "Brunswick Port", "Augusta", "Columbus"],
      },
      {
        name: "Pennsylvania",
        cities: ["Philadelphia Port", "Pittsburgh", "Allentown", "Erie"],
      },
      {
        name: "Ohio",
        cities: ["Cleveland Port", "Columbus", "Cincinnati", "Toledo"],
      },
    ],
  },

  "United Arab Emirates": {
    pincodeLabel: "PO Box / Makani *",
    pincodePlaceholder: "e.g. PO Box 12345 or Makani No.",
    pincodeHint: "UAE Makani No., Area Code or PO Box",
    states: [
      {
        name: "Dubai",
        cities: ["Jebel Ali Port", "Dubai City", "Deira", "Business Bay", "Al Quoz Industrial", "Dubai South", "Al Barsha"],
      },
      {
        name: "Abu Dhabi",
        cities: ["Khalifa Port", "Abu Dhabi City", "Musaffah Industrial Zone", "Al Ain", "Mina Zayed"],
      },
      {
        name: "Sharjah",
        cities: ["Port Khalid", "Hamriyah Free Zone", "Sharjah City", "Khorfakkan Port"],
      },
      {
        name: "Ajman",
        cities: ["Ajman Port", "Ajman City", "Ajman Free Zone"],
      },
      {
        name: "Ras Al Khaimah",
        cities: ["Saqr Port", "Ras Al Khaimah City", "RAK Free Trade Zone"],
      },
      {
        name: "Fujairah",
        cities: ["Port of Fujairah", "Fujairah City", "Dibba Al-Fujairah"],
      },
      {
        name: "Umm Al Quwain",
        cities: ["Ahmed Bin Rashid Port", "Umm Al Quwain City"],
      },
    ],
  },

  "Saudi Arabia": {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 11564",
    pincodeHint: "5-digit Saudi National Address / Postal Code",
    states: [
      {
        name: "Riyadh Region",
        cities: ["Riyadh City", "Al Kharj", "Diriyah", "Ad Dawadimi"],
      },
      {
        name: "Makkah Province",
        cities: ["Jeddah Islamic Port", "King Abdullah Port (Rabigh)", "Mecca", "Taif"],
      },
      {
        name: "Eastern Province",
        cities: ["Dammam (King Abdulaziz Port)", "Jubail Commercial Port", "Al Khobar", "Dhahran", "Ras Tanura"],
      },
      {
        name: "Medina Province",
        cities: ["Medina", "Yanbu Commercial & Industrial Port"],
      },
      {
        name: "Tabuk Province",
        cities: ["Tabuk", "Duba Port", "NEOM Gateway"],
      },
      {
        name: "Asir Province",
        cities: ["Abha", "Khamis Mushait"],
      },
    ],
  },

  "United Kingdom": {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. EC1A 1BB",
    pincodeHint: "UK Royal Mail Postcode",
    states: [
      {
        name: "England",
        cities: ["London", "Port of Felixstowe", "Port of Southampton", "Birmingham", "Manchester", "Liverpool Port", "Bristol Port", "Leeds", "Hull Port"],
      },
      {
        name: "Scotland",
        cities: ["Glasgow", "Edinburgh", "Grangemouth Port", "Aberdeen"],
      },
      {
        name: "Wales",
        cities: ["Cardiff", "Swansea Port", "Newport", "Holyhead Port"],
      },
      {
        name: "Northern Ireland",
        cities: ["Belfast Port", "Derry", "Lisburn"],
      },
    ],
  },

  Germany: {
    pincodeLabel: "Postal Code (PLZ) *",
    pincodePlaceholder: "e.g. 10115",
    pincodeHint: "5-digit German Postleitzahl (PLZ)",
    states: [
      {
        name: "Hamburg",
        cities: ["Port of Hamburg", "Hamburg City", "Altona", "Harburg"],
      },
      {
        name: "North Rhine-Westphalia",
        cities: ["Duisburg (Duisport)", "Cologne", "Düsseldorf", "Dortmund", "Essen"],
      },
      {
        name: "Bavaria",
        cities: ["Munich", "Nuremberg", "Augsburg", "Regensburg"],
      },
      {
        name: "Baden-Württemberg",
        cities: ["Stuttgart", "Mannheim Port", "Karlsruhe", "Freiburg"],
      },
      {
        name: "Hesse",
        cities: ["Frankfurt am Main", "Wiesbaden", "Kassel", "Darmstadt"],
      },
      {
        name: "Bremen",
        cities: ["Bremerhaven Port", "Bremen City"],
      },
      {
        name: "Berlin",
        cities: ["Berlin City", "Spandau", "Mitte"],
      },
    ],
  },

  Netherlands: {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 3011 AA",
    pincodeHint: "Dutch 4 digits + 2 letters (e.g. 3011 AA)",
    states: [
      {
        name: "South Holland",
        cities: ["Port of Rotterdam", "The Hague", "Dordrecht", "Delft", "Leiden"],
      },
      {
        name: "North Holland",
        cities: ["Port of Amsterdam", "Amsterdam City", "Haarlem", "Alkmaar", "Zaandam"],
      },
      {
        name: "North Brabant",
        cities: ["Eindhoven", "Tilburg", "Breda", "'s-Hertogenbosch", "Moerdijk Port"],
      },
      {
        name: "Utrecht",
        cities: ["Utrecht City", "Amersfoort", "Veenendaal"],
      },
      {
        name: "Zeeland",
        cities: ["North Sea Port (Vlissingen/Terneuzen)", "Middelburg"],
      },
    ],
  },

  Singapore: {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 018956",
    pincodeHint: "6-digit Singapore Postal Code",
    states: [
      {
        name: "Central Region",
        cities: ["Singapore City Center", "Marina Bay", "Tanjong Pagar Terminal", "Raffles Place"],
      },
      {
        name: "West Region",
        cities: ["Tuas Mega Port", "Jurong Port", "Jurong Industrial Estate", "Clementi"],
      },
      {
        name: "East Region",
        cities: ["Changi Air Cargo Hub", "Tampines", "Bedok", "Paya Lebar"],
      },
      {
        name: "North Region",
        cities: ["Woodlands", "Sembawang Wharves", "Yishun"],
      },
    ],
  },

  Australia: {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 2000",
    pincodeHint: "4-digit Australian Postcode",
    states: [
      {
        name: "New South Wales",
        cities: ["Port Botany (Sydney)", "Sydney", "Newcastle Port", "Port Kembla (Wollongong)"],
      },
      {
        name: "Victoria",
        cities: ["Port of Melbourne", "Melbourne", "Geelong Port", "Ballarat"],
      },
      {
        name: "Queensland",
        cities: ["Port of Brisbane", "Brisbane", "Townsville Port", "Gladstone Port", "Gold Coast"],
      },
      {
        name: "Western Australia",
        cities: ["Fremantle Port", "Perth", "Bunbury Port", "Port Hedland"],
      },
      {
        name: "South Australia",
        cities: ["Port Adelaide", "Adelaide", "Whyalla"],
      },
    ],
  },

  Canada: {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. M5V 2T6",
    pincodeHint: "Canadian Postal Code (e.g. A1A 1A1)",
    states: [
      {
        name: "Ontario",
        cities: ["Toronto", "Port of Hamilton", "Mississauga", "Ottawa", "Brampton"],
      },
      {
        name: "British Columbia",
        cities: ["Port of Vancouver", "Vancouver", "Prince Rupert Port", "Surrey", "Victoria"],
      },
      {
        name: "Quebec",
        cities: ["Port of Montreal", "Montreal", "Quebec City", "Laval"],
      },
      {
        name: "Alberta",
        cities: ["Calgary", "Edmonton", "Red Deer"],
      },
    ],
  },

  France: {
    pincodeLabel: "Code Postal *",
    pincodePlaceholder: "e.g. 75001",
    pincodeHint: "5-digit French Code Postal",
    states: [
      {
        name: "Provence-Alpes-Côte d'Azur",
        cities: ["Grand Port Maritime de Marseille", "Fos-sur-Mer Port", "Marseille", "Nice", "Toulon"],
      },
      {
        name: "Normandy",
        cities: ["HAROPA Port (Le Havre)", "Rouen Port", "Caen"],
      },
      {
        name: "Île-de-France",
        cities: ["Paris", "Boulogne-Billancourt", "Gennevilliers Port", "Saint-Denis"],
      },
      {
        name: "Auvergne-Rhône-Alpes",
        cities: ["Lyon", "Grenoble", "Saint-Étienne"],
      },
    ],
  },

  Italy: {
    pincodeLabel: "CAP (Codice Postale) *",
    pincodePlaceholder: "e.g. 20121",
    pincodeHint: "5-digit Italian CAP",
    states: [
      {
        name: "Liguria",
        cities: ["Port of Genoa", "Port of La Spezia", "Savona"],
      },
      {
        name: "Lombardy",
        cities: ["Milan", "Bergamo", "Brescia", "Monza"],
      },
      {
        name: "Veneto",
        cities: ["Port of Venice", "Verona", "Padua"],
      },
      {
        name: "Lazio",
        cities: ["Civitavecchia Port", "Rome", "Fiumicino"],
      },
      {
        name: "Campania",
        cities: ["Port of Naples", "Salerno Port"],
      },
    ],
  },

  Spain: {
    pincodeLabel: "Código Postal *",
    pincodePlaceholder: "e.g. 08001",
    pincodeHint: "5-digit Spanish Código Postal",
    states: [
      {
        name: "Catalonia",
        cities: ["Port of Barcelona", "Barcelona", "Tarragona Port", "Girona"],
      },
      {
        name: "Valencia",
        cities: ["Port of Valencia", "Valencia City", "Alicante Port", "Castellón Port"],
      },
      {
        name: "Andalusia",
        cities: ["Port of Algeciras", "Seville Port", "Málaga Port", "Cádiz Port"],
      },
      {
        name: "Madrid",
        cities: ["Madrid", "Getafe", "Alcalá de Henares"],
      },
      {
        name: "Basque Country",
        cities: ["Port of Bilbao", "Bilbao", "San Sebastián"],
      },
    ],
  },

  Malaysia: {
    pincodeLabel: "Poskod *",
    pincodePlaceholder: "e.g. 50450",
    pincodeHint: "5-digit Malaysian Poskod",
    states: [
      {
        name: "Selangor",
        cities: ["Port Klang (Northport & Westport)", "Shah Alam", "Petaling Jaya", "Klang"],
      },
      {
        name: "Kuala Lumpur",
        cities: ["Kuala Lumpur City", "Cheras", "Kepong"],
      },
      {
        name: "Johor",
        cities: ["Port of Tanjung Pelepas (PTP)", "Pasir Gudang Port", "Johor Bahru"],
      },
      {
        name: "Penang",
        cities: ["Penang Port (Butterworth)", "George Town", "Bayan Lepas"],
      },
    ],
  },

  Indonesia: {
    pincodeLabel: "Kode Pos *",
    pincodePlaceholder: "e.g. 10110",
    pincodeHint: "5-digit Indonesian Postal Code",
    states: [
      {
        name: "Jakarta",
        cities: ["Tanjung Priok Port", "North Jakarta", "Central Jakarta", "West Jakarta"],
      },
      {
        name: "East Java",
        cities: ["Tanjung Perak Port (Surabaya)", "Surabaya", "Gresik Port", "Sidoarjo"],
      },
      {
        name: "West Java",
        cities: ["Patimban Port", "Bandung", "Bekasi", "Cikarang Industrial Zone"],
      },
      {
        name: "North Sumatra",
        cities: ["Belawan Port (Medan)", "Medan", "Binjai"],
      },
    ],
  },

  Vietnam: {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 700000",
    pincodeHint: "5 to 6-digit Vietnam Postal Code",
    states: [
      {
        name: "Ho Chi Minh City",
        cities: ["Cat Lai Port", "Saigon Port", "District 1", "Thu Duc City"],
      },
      {
        name: "Haiphong",
        cities: ["Haiphong Port", "Dinh Vu Port", "Lach Huyen Deepsea Port"],
      },
      {
        name: "Ba Ria - Vung Tau",
        cities: ["Cai Mep - Thi Vai Deepsea Port Complex", "Vung Tau"],
      },
      {
        name: "Hanoi",
        cities: ["Hanoi City", "Long Bien", "Cau Giay"],
      },
      {
        name: "Da Nang",
        cities: ["Tien Sa Port", "Da Nang City"],
      },
    ],
  },

  Thailand: {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 10110",
    pincodeHint: "5-digit Thai Postal Code",
    states: [
      {
        name: "Chonburi",
        cities: ["Laem Chabang Port", "Si Racha", "Pattaya", "Chonburi City"],
      },
      {
        name: "Bangkok",
        cities: ["Bangkok Port (Khlong Toei)", "Chatuchak", "Bang Na"],
      },
      {
        name: "Rayong",
        cities: ["Map Ta Phut Industrial Port", "Rayong City"],
      },
      {
        name: "Samut Prakan",
        cities: ["Samut Prakan", "Bang Phli"],
      },
    ],
  },

  Oman: {
    pincodeLabel: "Postal Code / PO Box *",
    pincodePlaceholder: "e.g. 112",
    pincodeHint: "Oman 3-digit Postal Code or PO Box",
    states: [
      {
        name: "Muscat Governorate",
        cities: ["Port Sultan Qaboos", "Muscat City", "Muttrah", "Seeb", "Ruwi"],
      },
      {
        name: "Al Batinah North",
        cities: ["Port of Sohar & Freezone", "Sohar City", "Shinas"],
      },
      {
        name: "Dhofar Governorate",
        cities: ["Port of Salalah", "Salalah City", "Taqah"],
      },
      {
        name: "Al Wusta",
        cities: ["Port of Duqm & Special Economic Zone", "Duqm"],
      },
    ],
  },

  Qatar: {
    pincodeLabel: "Zone / PO Box *",
    pincodePlaceholder: "e.g. PO Box 12345 or Zone 57",
    pincodeHint: "Qatar Zone Number or PO Box",
    states: [
      {
        name: "Doha Municipality",
        cities: ["Doha Port", "West Bay", "Old Airport", "Corniche"],
      },
      {
        name: "Al Wakrah",
        cities: ["Hamad Port (Mesaieed)", "Al Wakrah City", "Mesaieed Industrial City"],
      },
      {
        name: "Al Rayyan",
        cities: ["Industrial Area", "Al Rayyan City", "Education City"],
      },
      {
        name: "Al Khor",
        cities: ["Ras Laffan Port & Industrial City", "Al Khor"],
      },
    ],
  },

  Kuwait: {
    pincodeLabel: "Postal Code / PO Box *",
    pincodePlaceholder: "e.g. 13001",
    pincodeHint: "Kuwait 5-digit Postal Code or PO Box",
    states: [
      {
        name: "Al Asimah (Capital)",
        cities: ["Shuwaikh Port", "Kuwait City", "Sharq", "Mirqab"],
      },
      {
        name: "Al Ahmadi",
        cities: ["Shuaiba Port", "Al Ahmadi City", "Mina Al Ahmadi"],
      },
      {
        name: "Farwaniya",
        cities: ["Farwaniya City", "Kuwait International Airport Zone", "Ardiya"],
      },
    ],
  },

  Bahrain: {
    pincodeLabel: "Block / Postal Code *",
    pincodePlaceholder: "e.g. Block 338 or 317",
    pincodeHint: "Bahrain Block Number or Postal Code",
    states: [
      {
        name: "Capital Governorate",
        cities: ["Mina Salman Port", "Manama City", "Seef District", "Juffair"],
      },
      {
        name: "Muharraq Governorate",
        cities: ["Khalifa Bin Salman Port (Hidd)", "Muharraq City", "Bahrain Logistics Zone"],
      },
      {
        name: "Southern Governorate",
        cities: ["Riffa", "Alba Industrial Area"],
      },
    ],
  },

  Egypt: {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 11511",
    pincodeHint: "5-digit Egyptian Postal Code",
    states: [
      {
        name: "Alexandria Governorate",
        cities: ["Alexandria Port", "El Dekheila Port", "Alexandria City"],
      },
      {
        name: "Port Said Governorate",
        cities: ["East Port Said Port", "West Port Said Port", "Port Said City"],
      },
      {
        name: "Suez Governorate",
        cities: ["Ain Sokhna Port", "Port of Suez", "Adabiya Port"],
      },
      {
        name: "Cairo Governorate",
        cities: ["Cairo City", "Nasr City", "New Cairo", "Heliopolis"],
      },
    ],
  },

  Turkey: {
    pincodeLabel: "Posta Kodu *",
    pincodePlaceholder: "e.g. 34000",
    pincodeHint: "5-digit Turkish Posta Kodu",
    states: [
      {
        name: "Istanbul",
        cities: ["Ambarli Port (Marport/Kumport)", "Haydarpasa Port", "Kadikoy", "Besiktas"],
      },
      {
        name: "Izmir",
        cities: ["Port of Izmir (Alsancak)", "Aliaga Port (Nemrut Bay)", "Izmir City"],
      },
      {
        name: "Mersin",
        cities: ["Mersin International Port (MIP)", "Mersin City", "Tarsus"],
      },
      {
        name: "Kocaeli",
        cities: ["Evyap Port", "Yilport Gebze", "Izmit", "Gebze"],
      },
    ],
  },

  "South Africa": {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 4001",
    pincodeHint: "4-digit South African Postal Code",
    states: [
      {
        name: "KwaZulu-Natal",
        cities: ["Port of Durban", "Richards Bay Port", "Durban City"],
      },
      {
        name: "Western Cape",
        cities: ["Port of Cape Town", "Cape Town", "Saldanha Bay Port"],
      },
      {
        name: "Eastern Cape",
        cities: ["Port of Ngqura (Coega)", "Port Elizabeth (Gqeberha)", "East London Port"],
      },
      {
        name: "Gauteng",
        cities: ["Johannesburg (City Deep Dry Port)", "Pretoria", "Midrand"],
      },
    ],
  },

  Brazil: {
    pincodeLabel: "CEP *",
    pincodePlaceholder: "e.g. 01001-000",
    pincodeHint: "8-digit Brazilian CEP",
    states: [
      {
        name: "São Paulo",
        cities: ["Port of Santos", "São Paulo City", "Campinas", "Guarulhos"],
      },
      {
        name: "Paraná",
        cities: ["Port of Paranaguá", "Curitiba", "Antonina Port"],
      },
      {
        name: "Santa Catarina",
        cities: ["Port of Itajaí", "Port of Navegantes (Portonave)", "São Francisco do Sul Port"],
      },
      {
        name: "Rio de Janeiro",
        cities: ["Port of Rio de Janeiro", "Itaguaí Port (Sepetiba)", "Rio de Janeiro City"],
      },
    ],
  },

  Japan: {
    pincodeLabel: "Postal Code (〒) *",
    pincodePlaceholder: "e.g. 100-0001",
    pincodeHint: "7-digit Japanese Postal Code (〒000-0000)",
    states: [
      {
        name: "Tokyo",
        cities: ["Port of Tokyo", "Tokyo City", "Shinagawa", "Ota"],
      },
      {
        name: "Kanagawa",
        cities: ["Port of Yokohama", "Yokohama City", "Kawasaki Port"],
      },
      {
        name: "Aichi",
        cities: ["Port of Nagoya", "Nagoya City", "Toyota City"],
      },
      {
        name: "Hyogo",
        cities: ["Port of Kobe", "Kobe City", "Amagasaki"],
      },
      {
        name: "Osaka",
        cities: ["Port of Osaka", "Osaka City", "Sakai Port"],
      },
    ],
  },

  "South Korea": {
    pincodeLabel: "Postal Code *",
    pincodePlaceholder: "e.g. 03186",
    pincodeHint: "5-digit Korean Postal Code",
    states: [
      {
        name: "Busan",
        cities: ["Busan New Port", "Busan North Port", "Busan City"],
      },
      {
        name: "Incheon",
        cities: ["Port of Incheon", "Incheon Free Economic Zone (Songdo)"],
      },
      {
        name: "Gyeonggi-do",
        cities: ["Pyeongtaek-Dangjin Port", "Suwon", "Seongnam"],
      },
      {
        name: "Seoul",
        cities: ["Seoul City", "Gangnam", "Yeongdeungpo"],
      },
      {
        name: "Jeollanam-do",
        cities: ["Gwangyang Port", "Yeosu Port"],
      },
    ],
  },

  Philippines: {
    pincodeLabel: "ZIP Code *",
    pincodePlaceholder: "e.g. 1000",
    pincodeHint: "4-digit Philippine ZIP Code",
    states: [
      {
        name: "Metro Manila",
        cities: ["Port of Manila (MICT & South Harbor)", "Manila City", "Quezon City", "Pasay"],
      },
      {
        name: "Calabarzon",
        cities: ["Batangas Port", "Calamba", "Santa Rosa"],
      },
      {
        name: "Central Visayas",
        cities: ["Port of Cebu", "Cebu City", "Mandaue"],
      },
      {
        name: "Davao Region",
        cities: ["Port of Davao (Sasa Wharf)", "Davao City"],
      },
      {
        name: "Central Luzon",
        cities: ["Subic Bay Port", "Clark Freeport Zone", "Angeles City"],
      },
    ],
  },

  "New Zealand": {
    pincodeLabel: "Postcode *",
    pincodePlaceholder: "e.g. 1010",
    pincodeHint: "4-digit NZ Postcode",
    states: [
      {
        name: "Auckland Region",
        cities: ["Port of Auckland", "Auckland City", "Manukau", "North Shore"],
      },
      {
        name: "Bay of Plenty",
        cities: ["Port of Tauranga", "Tauranga", "Mount Maunganui"],
      },
      {
        name: "Canterbury",
        cities: ["Lyttelton Port (Christchurch)", "Christchurch City"],
      },
      {
        name: "Wellington Region",
        cities: ["CentrePort Wellington", "Wellington City", "Lower Hutt"],
      },
      {
        name: "Hawke's Bay",
        cities: ["Napier Port", "Napier", "Hastings"],
      },
    ],
  },
};

// Default fallback configuration for countries not explicitly indexed
export const DEFAULT_GEO_CONFIG: CountryGeoConfig = {
  pincodeLabel: "Postal / PIN Code *",
  pincodePlaceholder: "e.g. 10001",
  pincodeHint: "Destination Postal Code or ZIP Code",
  states: [],
};

/**
 * Helper to fetch Geo config for a country name
 */
export function getGeoConfigForCountry(countryName: string | undefined): CountryGeoConfig {
  if (!countryName) return DEFAULT_GEO_CONFIG;
  return COUNTRY_GEO_DATA[countryName] || DEFAULT_GEO_CONFIG;
}
