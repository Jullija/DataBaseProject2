export const getCurrentUser = async () => {
    try {
        const response = await fetch('/api/users/current');
        if (response.status === 200) {
            const user = await response.json();
            console.log('Current user:', user);
            // Update the UI or store the user data as needed
        } else {
            const errorMessage = await response.text();
            console.log('Error getting current user:', errorMessage);
        }
    } catch (err) {
        console.error('Error getting current user:', err);
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

