const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-red-300 h-full">
            <h1>Auth Layout</h1>
            {children}
        </div>
    );
}

export default AuthLayout;