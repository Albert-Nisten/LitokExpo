const DashMenu = [
    {
    "title": "Dashboard",
    "icon": "dashboard",
    "route": "/admin/dashboard"
    },
    {
    "title": "Usuários",
    "icon": "users",
    "submenu": [
        {
        "title": "Gerenciar Usuários",
        "route": "/admin/users"
        },
        {
        "title": "Validações de Usuários",
        "route": "/admin/users/validations"
        },
        {
        "title": "Endereços de Usuários",
        "route": "/admin/users/addresses"
        }
    ]
    },
    {
    "title": "Mercados",
    "icon": "store",
    "route": "/admin/markets"
    },
    {
    "title": "Produtos",
    "icon": "box",
    "submenu": [
        {
        "title": "Gerenciar Produtos",
        "route": "/admin/products"
        },
        {
        "title": "Categorias",
        "route": "/admin/products/categories"
        },
        {
        "title": "Cores dos Produtos",
        "route": "/admin/products/colors"
        },
        {
        "title": "Imagens dos Produtos",
        "route": "/admin/products/pictures"
        }
    ]
    },
    {
    "title": "Pedidos",
    "icon": "shopping-cart",
    "submenu": [
        {
        "title": "Gerenciar Pedidos",
        "route": "/admin/orders"
        },
        {
        "title": "Itens dos Pedidos",
        "route": "/admin/orders/items"
        }
    ]
    },
    {
    "title": "Carrinho de Compras",
    "icon": "shopping-basket",
    "submenu": [
        {
        "title": "Gerenciar Carrinhos",
        "route": "/admin/carts"
        },
        {
        "title": "Itens dos Carrinhos",
        "route": "/admin/carts/items"
        }
    ]
    },
    {
    "title": "Notificações",
    "icon": "bell",
    "route": "/admin/notifications"
    },
    {
    "title": "Localização",
    "icon": "map-marker",
    "submenu": [
        {
        "title": "Países",
        "route": "/admin/locations/countries"
        },
        {
        "title": "Províncias",
        "route": "/admin/locations/provinces"
        },
        {
        "title": "Municípios",
        "route": "/admin/locations/municipalities"
        }
    ]
    },
    {
    "title": "Configurações",
    "icon": "settings",
    "route": "/admin/settings"
    }
]


  export default DashMenu