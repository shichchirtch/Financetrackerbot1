export async function getUserExpenses(url) {

    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.detail || "API error");
    }

    return data;
}
