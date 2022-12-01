import { createContext } from "react";

type MenuContextType = {
    isMenuVisible: boolean;
    setMenuVisible: (isVisible: boolean) => void;
}

export const MenuContext = createContext<MenuContextType>({
    isMenuVisible: false,
    setMenuVisible: () => {}
})