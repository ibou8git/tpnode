function showNotification(type, message) {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notifications.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Exemple d'utilisation
showNotification('success', 'Votre message a été envoyé avec succès.');