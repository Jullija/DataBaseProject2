export const getCurrentUser = async () => {
    try {
        const response = await fetch('/api/users/current');
        if (response.status === 200) {
            const user = await response.json();
            // console.log('Current user:', user);
            return user;
            // Update the UI or store the user data as needed
        } else {
            const errorMessage = await response.text();
            console.log('Error getting current user:', errorMessage);
            return null;
        }
    } catch (err) {
        console.error('Error getting current user:', err);
        return null;
    }
};

export const isLoggedIn = async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      // console.log('Użytkownik jest zalogowany:', currentUser);
      return true;
    } else {
      // console.log('Użytkownik nie jest zalogowany');
      return false;
    }
};

// user.js

export const logOutUser = async () => {
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
        });

        if (response.status === 200) {
            console.log('Logged out successfully');
            window.location.reload();
            // Update the UI or redirect to the login page
        } else {
            const errorMessage = await response.text();
            console.log('Error logging out:', errorMessage);
            // Show an error message or handle the error as needed
        }
    } catch (err) {
        console.error('Error logging out:', err);
    }
};

export const getBasketItems = async () => {
    try {
        const user = await getCurrentUser();

        if (!user) {
            console.log('No user is currently logged in');
            return [];
        }

        const response = await fetch(`/api/users/${user._id}/basket`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const items = await response.json();
            console.log('Fetched basket items successfully:', items);
            return items;
        } else {
            const errorMessage = await response.text();
            console.error('Error fetching basket items:', errorMessage);
            return [];
        }
    } catch (err) {
        console.error('Error fetching basket items:', err);
        return [];
    }
};
