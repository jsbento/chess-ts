import Image from "next/image";
import React from "react";

const Logo: React.FC = () => {
    return (
        <a href="/" className="flex items-center">
            <Image src="/Chess_klt60.png" alt="Chess Logo" width={75} height={75} />
            <p className="font-bold text-xl">Chess-TS</p>
        </a>
    );
}

export default Logo;