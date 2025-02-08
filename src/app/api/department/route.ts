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

interface Department {
  male: number;
  female: number;
  ageRange: {
    min: number;
    max: number;
  };
  hair: { [color: string]: number };
  addressUser: { [fullName: string]: string };
}

interface DepartmentResponse extends Omit<Department, "ageRange"> {
  ageRange: string;
}

const groupByDepartment = (
  users: User[]
): Record<string, DepartmentResponse> => {
  const departmentSummary: Record<string, Department> = {};

  users.forEach((user) => {
    const department = user.company.department;

    if (!departmentSummary[department]) {
      departmentSummary[department] = {
        male: 0,
        female: 0,
        ageRange: {
          min: user.age,
          max: user.age,
        },
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

    // Hair Color Count
    const hairColor = user.hair.color;
    dept.hair[hairColor] = (dept.hair[hairColor] || 0) + 1;

    // Address User Summary
    dept.addressUser[`${user.firstName}${user.lastName}`] =
      user.address.postalCode;
  });

  return Object.fromEntries(
    Object.entries(departmentSummary).map(([dept, data]) => [
      dept,
      {
        ...data,
        ageRange: `${data.ageRange.min}-${data.ageRange.max}`,
      },
    ])
  );
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
