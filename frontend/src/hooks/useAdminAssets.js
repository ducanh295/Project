import { useEffect } from 'react';

export default function useAdminAssets() {
    useEffect(() => {
        // Thêm CSS AdminLTE
        const adminCss = document.createElement('link');
        adminCss.rel = 'stylesheet';
        adminCss.href = '/assets/dist/css/adminlte.min.css';
        document.head.appendChild(adminCss);
        // 1. Load jQuery
        const jquery = document.createElement('script');
        jquery.src = '/assets/plugins/jquery/jquery.min.js';
        jquery.async = false;
        document.body.appendChild(jquery);

        // 2. Load Bootstrap JS
        const bootstrap = document.createElement('script');
        bootstrap.src = '/assets/plugins/bootstrap/js/bootstrap.bundle.min.js';
        bootstrap.async = false;
        document.body.appendChild(bootstrap);

        // 3. Load AdminLTE JS (nếu thực sự cần)
        const adminlte = document.createElement('script');
        adminlte.src = '/assets/dist/js/adminlte.min.js';
        adminlte.async = false;
        document.body.appendChild(adminlte);

        // Cleanup
        return () => {
            document.body.removeChild(jquery);
            document.body.removeChild(bootstrap);
            document.body.removeChild(adminlte);
        };
    }, []);
}
