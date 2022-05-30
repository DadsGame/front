export default async function handler(request, response) {
    const registerUrl = new URL('/register', process.env.NEXT_PUBLIC_MAIN_API_URL);
    const {res, error} = await fetch(registerUrl.toString(), {
        method: 'POST',
        body: {username: formData.username, password: formData.password, email: formData.email, profilePicture: ''}
    });
    return (error)
        ? response.status(res.status).end(error.message)
        : response.status(res.status).end('User created');
}