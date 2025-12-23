import AppLogoIcon from './app-logo-icon';
import Icon from '@/img/Icon.svg';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <img src={Icon} alt="Logo" className="size-14 fill-current text-[var(--foreground)] dark:text-white"/>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {/* Laravel Starter Kit */}
                    Insurance Services
                </span>
            </div>
        </>
    );
}
