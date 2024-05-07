const Logout = () => {

    localStorage.clear();
    // window.location.href = '/login';
    // window.location.reload();

    // Get the current URL
    var currentUrl = window.location.href;

    // Find the last slash
    var lastSlashIndex = currentUrl.lastIndexOf('/');

    // Extract the base URL (excluding the last segment)
    var baseUrl = currentUrl.substring(0, lastSlashIndex);

    // Redirect to the new URL with '/home' as the last segment
    window.location.href = baseUrl + '/login';
}

export default Logout;