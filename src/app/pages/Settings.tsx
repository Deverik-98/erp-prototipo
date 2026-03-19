import { useState } from "react";
import {
  Shield,
  UserCog,
  Eye,
  Activity,
  Download,
  Search,
  Plus,
  Info,
  Lock,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "sonner";

const usersData = [
  {
    id: 1,
    nombre: "Admin Principal",
    correo: "admin@empresa.com",
    rol: "Admin",
    permisos: ["Todo"],
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "María González",
    correo: "maria.g@empresa.com",
    rol: "Cajero",
    permisos: ["Ventas", "Ver Inventario"],
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Carlos Pérez",
    correo: "carlos.p@empresa.com",
    rol: "Cajero",
    permisos: ["Ventas", "Ver Inventario"],
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Ana López",
    correo: "ana.l@empresa.com",
    rol: "Admin",
    permisos: ["Todo"],
    estado: "Inactivo",
  },
];

type AuditLogEntry = {
  id: number;
  usuario: string;
  accion: string;
  detalle: string;
  fecha: string;
  tipo: string;
  ip: string;
};

const auditLogData: AuditLogEntry[] = [
  {
    id: 1,
    usuario: "Admin Principal",
    accion: "Eliminó producto",
    detalle: 'Producto "Leche Deslactosada 1L" (SKU: LEC-009)',
    fecha: "19 Mar 2026, 14:30",
    tipo: "delete",
    ip: "192.168.1.105",
  },
  {
    id: 2,
    usuario: "María González",
    accion: "Modificó inventario",
    detalle:
      'Producto "Queso Fresco 500g" - Stock actualizado: 45 unidades',
    fecha: "19 Mar 2026, 13:15",
    tipo: "edit",
    ip: "192.168.1.112",
  },
  {
    id: 3,
    usuario: "Admin Principal",
    accion: "Creó nuevo cliente",
    detalle:
      'Cliente "Roberto Jiménez" - Tel: +54 11 9517-5328',
    fecha: "19 Mar 2026, 11:45",
    tipo: "create",
    ip: "192.168.1.105",
  },
  {
    id: 4,
    usuario: "Carlos Pérez",
    accion: "Procesó venta",
    detalle: "Pedido #1247 - Total: $ 450",
    fecha: "19 Mar 2026, 10:30",
    tipo: "sale",
    ip: "192.168.1.108",
  },
  {
    id: 5,
    usuario: "Admin Principal",
    accion: "Modificó usuario",
    detalle: 'Usuario "Ana López" - Estado cambiado a Inactivo',
    fecha: "18 Mar 2026, 16:20",
    tipo: "edit",
    ip: "192.168.1.105",
  },
  {
    id: 6,
    usuario: "María González",
    accion: "Eliminó pedido",
    detalle: "Pedido #1240 - Cliente: Juan Herrera",
    fecha: "18 Mar 2026, 15:10",
    tipo: "delete",
    ip: "192.168.1.112",
  },
  {
    id: 7,
    usuario: "Admin Principal",
    accion: "Importación masiva",
    detalle: "25 productos importados desde Excel",
    fecha: "18 Mar 2026, 09:00",
    tipo: "import",
    ip: "192.168.1.105",
  },
  {
    id: 8,
    usuario: "Carlos Pérez",
    accion: "Inicio de sesión",
    detalle: "Acceso exitoso al sistema",
    fecha: "19 Mar 2026, 08:15",
    tipo: "login",
    ip: "192.168.1.108",
  },
  {
    id: 9,
    usuario: "Admin Principal",
    accion: "Cambió política de contraseñas",
    detalle: "Expiración actualizada a 90 días",
    fecha: "17 Mar 2026, 11:00",
    tipo: "edit",
    ip: "192.168.1.105",
  },
];

const permissions = [
  { id: "ventas", label: "Gestión de Ventas" },
  { id: "inventario", label: "Gestión de Inventario" },
  { id: "clientes", label: "Gestión de Clientes" },
  { id: "reportes", label: "Ver Reportes" },
  { id: "usuarios", label: "Administrar Usuarios" },
  { id: "config", label: "Configuración del Sistema" },
];

type RoleConfig = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: typeof Shield;
  permissions: string[];
};

const initialRoles: RoleConfig[] = [
  {
    id: "admin",
    name: "Administrador",
    description:
      "Control total del sistema. Puede gestionar usuarios, roles, inventario, ventas y configuración. Acceso jerárquico máximo.",
    color: "purple",
    icon: Shield,
    permissions: permissions.map((p) => p.id),
  },
  {
    id: "cajero",
    name: "Cajero",
    description:
      "Operación de punto de venta y atención a clientes. Acceso limitado a ventas, consulta de inventario y directorio de clientes. No puede modificar configuración ni usuarios.",
    color: "blue",
    icon: UserCog,
    permissions: ["ventas", "clientes"],
  },
];

const securityPolicies = [
  {
    id: "password",
    title: "Política de Contraseñas",
    description: "Configuración de requisitos y expiración",
    icon: Lock,
    settings: [
      { label: "Longitud mínima", value: "8 caracteres" },
      { label: "Expiración", value: "90 días" },
      { label: "Reintentos fallidos", value: "5 intentos" },
    ],
  },
  {
    id: "sessions",
    title: "Sesiones y Accesos",
    description: "Control de sesiones simultáneas y tiempo de inactividad",
    icon: Shield,
    settings: [
      { label: "Sesiones simultáneas", value: "2 por usuario" },
      { label: "Timeout inactividad", value: "30 minutos" },
      { label: "Bloqueo temporal", value: "15 minutos" },
    ],
  },
  {
    id: "audit",
    title: "Auditoría",
    description: "Registro y retención de eventos",
    icon: FileText,
    settings: [
      { label: "Retención de logs", value: "365 días" },
      { label: "Registro de IP", value: "Habilitado" },
      { label: "Exportación", value: "CSV, Excel" },
    ],
  },
];

function exportToCSV(data: AuditLogEntry[]) {
  const headers = ["Usuario", "Acción", "Detalle", "Fecha", "Tipo", "IP"];
  const rows = data.map((r) =>
    [r.usuario, r.accion, r.detalle, r.fecha, r.tipo, r.ip].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bitacora-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Settings() {
  const [roles, setRoles] = useState(initialRoles);
  const [auditFilterUser, setAuditFilterUser] = useState("all");
  const [auditFilterType, setAuditFilterType] = useState("all");
  const [auditSearch, setAuditSearch] = useState("");
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const getActionBadge = (tipo: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
    > = {
      delete: { variant: "destructive", label: "Eliminación" },
      edit: { variant: "default", label: "Modificación" },
      create: { variant: "default", label: "Creación" },
      sale: { variant: "default", label: "Venta" },
      import: { variant: "default", label: "Importación" },
      login: { variant: "secondary", label: "Login" },
    };

    const config = variants[tipo] || {
      variant: "secondary" as const,
      label: tipo,
    };

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const filteredAudit = auditLogData.filter((log) => {
    const matchUser =
      auditFilterUser === "all" || log.usuario === auditFilterUser;
    const matchType = auditFilterType === "all" || log.tipo === auditFilterType;
    const matchSearch =
      !auditSearch ||
      log.usuario.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.accion.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.detalle.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ip.includes(auditSearch);
    return matchUser && matchType && matchSearch;
  });

  const handleExportCSV = () => {
    exportToCSV(filteredAudit);
    toast.success("Bitácora exportada en CSV");
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    const id = `rol-${Date.now()}`;
    setRoles([
      ...roles,
      {
        id,
        name: newRoleName,
        description: newRoleDesc || "Sin descripción",
        color: "gray",
        icon: UserCog,
        permissions: [],
      },
    ]);
    setNewRoleName("");
    setNewRoleDesc("");
    setNewRoleOpen(false);
    toast.success(`Rol "${newRoleName}" creado`);
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(
      roles.map((r) => {
        if (r.id !== roleId) return r;
        const has = r.permissions.includes(permissionId);
        return {
          ...r,
          permissions: has
            ? r.permissions.filter((p) => p !== permissionId)
            : [...r.permissions, permissionId],
        };
      })
    );
  };

  const uniqueUsers = [...new Set(auditLogData.map((l) => l.usuario))];
  const uniqueTypes = [...new Set(auditLogData.map((l) => l.tipo))];

  return (
    <TooltipProvider>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configuración y Seguridad
          </h1>
          <p className="text-gray-500 mt-2">
            Gestiona usuarios, roles, políticas de seguridad y auditoría
          </p>
        </div>

        <Tabs defaultValue="usuarios-roles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="usuarios-roles" className="gap-2">
              <UserCog className="w-4 h-4" />
              Usuarios y Roles
            </TabsTrigger>
            <TabsTrigger value="politicas" className="gap-2">
              <Lock className="w-4 h-4" />
              Políticas de Seguridad
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="gap-2">
              <Activity className="w-4 h-4" />
              Bitácora de Actividad
            </TabsTrigger>
          </TabsList>

          {/* Usuarios y Roles - Tab unificada */}
          <TabsContent value="usuarios-roles" className="space-y-6">
            {/* Info Acceso Jerárquico */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900">
                    Acceso Jerárquico
                  </h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Los roles definen el nivel de acceso. Admin tiene control total.
                    Cajero opera ventas e inventario. Los permisos se heredan según
                    la jerarquía configurada.
                  </p>
                </div>
              </div>
            </Card>

            {/* Roles */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Roles del Sistema</h3>
              <Dialog open={newRoleOpen} onOpenChange={setNewRoleOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Rol
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Rol</DialogTitle>
                    <DialogDescription>
                      Define un rol con nombre y descripción. Luego configura los permisos.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Nombre del rol</Label>
                      <Input
                        placeholder="Ej: Supervisor"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Descripción</Label>
                      <Input
                        placeholder="Descripción del rol y su alcance..."
                        value={newRoleDesc}
                        onChange={(e) => setNewRoleDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewRoleOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddRole} disabled={!newRoleName.trim()}>
                      Crear Rol
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                const colorClass =
                  role.color === "purple"
                    ? "bg-purple-100 text-purple-600"
                    : role.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600";
                return (
                  <Card key={role.id} className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{role.name}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {role.description}
                        </p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 mt-1 p-0"
                            >
                              <Info className="w-3.5 h-3.5 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {role.description}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Permisos:
                    </p>
                    <div className="space-y-2">
                      {permissions.map((perm) => (
                        <div
                          key={perm.id}
                          className="flex items-center justify-between"
                        >
                          <Label
                            htmlFor={`${role.id}-${perm.id}`}
                            className="text-sm"
                          >
                            {perm.label}
                          </Label>
                          <Switch
                            id={`${role.id}-${perm.id}`}
                            checked={role.permissions.includes(perm.id)}
                            onCheckedChange={() =>
                              togglePermission(role.id, perm.id)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button>Guardar Cambios en Roles</Button>
            </div>

            {/* Tabla de Usuarios */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Usuarios del Sistema</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Usuarios asignados a cada rol
                  </p>
                </div>
                <Button>Agregar Usuario</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Permisos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nombre}</TableCell>
                      <TableCell className="text-gray-600">{user.correo}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.rol === "Admin" ? "default" : "secondary"
                          }
                        >
                          {user.rol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permisos.slice(0, 2).map((permiso, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {permiso}
                            </Badge>
                          ))}
                          {user.permisos.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.permisos.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.estado === "Activo" ? "default" : "secondary"
                          }
                        >
                          {user.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Políticas de Seguridad */}
          <TabsContent value="politicas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {securityPolicies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <Card key={policy.id} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{policy.title}</h4>
                        <p className="text-sm text-gray-500">
                          {policy.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {policy.settings.map((s) => (
                        <div
                          key={s.label}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">{s.label}</span>
                          <span className="font-medium">{s.value}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      Configurar
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Bitácora de Actividad */}
          <TabsContent value="auditoria" className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    Historial de Auditoría
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Registro de todas las acciones en el sistema con IP
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={auditFilterUser}
                    onValueChange={setAuditFilterUser}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los usuarios</SelectItem>
                      {uniqueUsers.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={auditFilterType}
                    onValueChange={setAuditFilterType}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {uniqueTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t === "delete"
                            ? "Eliminación"
                            : t === "edit"
                              ? "Modificación"
                              : t === "create"
                                ? "Creación"
                                : t === "sale"
                                  ? "Venta"
                                  : t === "import"
                                    ? "Importación"
                                    : t === "login"
                                      ? "Login"
                                      : t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Exportar
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleExportCSV}>
                        Exportar como CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast.info("Exportación Excel en desarrollo")
                        }
                      >
                        Exportar como Excel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudit.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.usuario}</TableCell>
                      <TableCell>{log.accion}</TableCell>
                      <TableCell className="max-w-md text-gray-600">
                        {log.detalle}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {log.fecha}
                      </TableCell>
                      <TableCell>{getActionBadge(log.tipo)}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-500">
                        {log.ip}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredAudit.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No hay registros que coincidan con los filtros
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
