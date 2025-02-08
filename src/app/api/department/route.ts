interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    postalCode: string;
  };
  company: {
    department: string;
  };
}

const groupByDepartment = (users: User[]) => {
  const departmentSummary: Record<string, any> = {};

  users.forEach((user) => {
    const department = user.company.department;

    // Initialize department group if not already
    if (!departmentSummary[department]) {
      departmentSummary[department] = {
        male: 0,
        female: 0,
        ageRange: { min: Infinity, max: -Infinity },
        hair: {},
        addressUser: {},
      };
    }

    const dept = departmentSummary[department];

    // Gender Count
    if (user.gender === "male") dept.male++;
    if (user.gender === "female") dept.female++;

    // Age Range
    dept.ageRange.min = Math.min(dept.ageRange.min, user.age);
    dept.ageRange.max = Math.max(dept.ageRange.max, user.age);

    // Hair Color Count (dynamically add new colors if they don't exist)
    const hairColor = user.hair.color;
    if (!dept.hair[hairColor]) {
      dept.hair[hairColor] = 0;
    }
    dept.hair[hairColor]++;

    // Address User Summary
    dept.addressUser[`${user.firstName}${user.lastName}`] =
      user.address.postalCode;
  });

  // Format age range as a string (e.g., "20-30")
  for (const department in departmentSummary) {
    const dept = departmentSummary[department];
    if (dept.ageRange.min === Infinity && dept.ageRange.max === -Infinity) {
      dept.ageRange = "N/A"; // In case no age data was available
    } else {
      dept.ageRange = `${dept.ageRange.min}-${dept.ageRange.max}`;
    }
  }

  return departmentSummary;
};

export async function GET() {
  const baseUrl = process.env.DATA_API_URL; //https://dummyjson.com

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const res = await fetch(baseUrl + "/users", {
    headers,
  });

  if (!res.ok) {
    // Handle any errors from the fetch
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return Response.json(groupByDepartment(data["users"]));
}
