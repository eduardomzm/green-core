import { useEffect, useState } from "react";

export const OfflineDetector = ({ children }: any) => {

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {

        const goOnline = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);

        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);

        return () => {
        window.removeEventListener("online", goOnline);
        window.removeEventListener("offline", goOffline);
        };

    }, []);

    if (!isOnline) {
        return (
        <div className="w-screen h-screen overflow-hidden">

            <img
                src="/assets/img/ModoOffline.png"
                alt="Sin conexión"
                className="w-full h-full object-cover"
            />

        </div>
        );
    }

    return children;
};