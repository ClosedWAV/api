export const createJwt = async (username: string, sign: (payload: Record<string, string | number>) => Promise<string>, auth: {set: (payload: Record<string, unknown>) => unknown}) => {
    const value = await sign({username})
    auth.set({
        value: value,
        httpOnly: true,
        maxAge: 7 * 86400,
        path: '/profile',
    })
}