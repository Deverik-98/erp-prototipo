import { useState, useCallback, useEffect } from "react";
import {
  Shield,
  UserCog,
  Eye,
  Pencil,
  Activity,
  Download,
  Search,
  Plus,
  Info,
  Lock,
  FileText,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  AlertCircle,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { toast } from "sonner";

type UserRow = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  permisos: string[];
  estado: string;
};

const initialUsersData: UserRow[] = [
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
  timestamp: number;
};

const auditLogData: AuditLogEntry[] = [
  { id: 1, usuario: "Admin Principal", accion: "Eliminó producto", detalle: 'Producto "Leche Deslactosada 1L" (SKU: LEC-009)', fecha: "19 Mar 2026, 14:30", tipo: "delete", ip: "192.168.1.105", timestamp: new Date("2026-03-19T14:30").getTime() },
  { id: 2, usuario: "María González", accion: "Modificó inventario", detalle: 'Producto "Queso Fresco 500g" - Stock actualizado: 45 unidades', fecha: "19 Mar 2026, 13:15", tipo: "edit", ip: "192.168.1.112", timestamp: new Date("2026-03-19T13:15").getTime() },
  { id: 3, usuario: "Admin Principal", accion: "Creó nuevo cliente", detalle: 'Cliente "Roberto Jiménez" - Tel: +54 11 9517-5328', fecha: "19 Mar 2026, 11:45", tipo: "create", ip: "192.168.1.105", timestamp: new Date("2026-03-19T11:45").getTime() },
  { id: 4, usuario: "Carlos Pérez", accion: "Procesó venta", detalle: "Pedido #1247 - Total: $ 450", fecha: "19 Mar 2026, 10:30", tipo: "sale", ip: "192.168.1.108", timestamp: new Date("2026-03-19T10:30").getTime() },
  { id: 5, usuario: "Admin Principal", accion: "Modificó usuario", detalle: 'Usuario "Ana López" - Estado cambiado a Inactivo', fecha: "18 Mar 2026, 16:20", tipo: "edit", ip: "192.168.1.105", timestamp: new Date("2026-03-18T16:20").getTime() },
  { id: 6, usuario: "María González", accion: "Eliminó pedido", detalle: "Pedido #1240 - Cliente: Juan Herrera", fecha: "18 Mar 2026, 15:10", tipo: "delete", ip: "192.168.1.112", timestamp: new Date("2026-03-18T15:10").getTime() },
  { id: 7, usuario: "Admin Principal", accion: "Importación masiva", detalle: "25 productos importados desde Excel", fecha: "18 Mar 2026, 09:00", tipo: "import", ip: "192.168.1.105", timestamp: new Date("2026-03-18T09:00").getTime() },
  { id: 8, usuario: "Carlos Pérez", accion: "Inicio de sesión", detalle: "Acceso exitoso al sistema", fecha: "19 Mar 2026, 08:15", tipo: "login", ip: "192.168.1.108", timestamp: new Date("2026-03-19T08:15").getTime() },
  { id: 9, usuario: "Admin Principal", accion: "Cambió política de contraseñas", detalle: "Expiración actualizada a 90 días", fecha: "17 Mar 2026, 11:00", tipo: "edit", ip: "192.168.1.105", timestamp: new Date("2026-03-17T11:00").getTime() },
  { id: 10, usuario: "María González", accion: "Modificó inventario", detalle: 'Producto "Yogurt Natural" - Stock: 200', fecha: "16 Mar 2026, 14:00", tipo: "edit", ip: "192.168.1.112", timestamp: new Date("2026-03-16T14:00").getTime() },
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
  { id: "admin", name: "Administrador", description: "Control total del sistema. Puede gestionar usuarios, roles, inventario, ventas y configuración. Acceso jerárquico máximo.", color: "purple", icon: Shield, permissions: permissions.map((p) => p.id) },
  { id: "cajero", name: "Cajero", description: "Operación de punto de venta y atención a clientes. Acceso limitado a ventas, consulta de inventario y directorio de clientes.", color: "blue", icon: UserCog, permissions: ["ventas", "clientes"] },
  { id: "supervisor", name: "Supervisor", description: "Supervisa operaciones de venta e inventario. Puede ver reportes y gestionar clientes.", color: "green", icon: UserCog, permissions: ["ventas", "inventario", "clientes", "reportes"] },
];

type PolicyConfig = {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  icon: typeof Lock;
  settings: { label: string; value: string; tooltip?: string; recommended?: boolean }[];
};

const securityPolicies: PolicyConfig[] = [
  {
    id: "password",
    title: "Política de Contraseñas",
    description: "Requisitos y expiración de contraseñas",
    tooltip: "Define la longitud mínima, tiempo de expiración y bloqueo tras intentos fallidos.",
    icon: Lock,
    settings: [
      { label: "Longitud mínima", value: "8 caracteres", tooltip: "Mínimo recomendado para seguridad", recommended: true },
      { label: "Expiración", value: "90 días", tooltip: "Fuerza cambio periódico de contraseña" },
      { label: "Reintentos fallidos", value: "5 intentos", recommended: true },
    ],
  },
  {
    id: "sessions",
    title: "Sesiones y Accesos",
    description: "Control de sesiones y tiempo de inactividad",
    tooltip: "Limita sesiones concurrentes (ej. PC + celular) y cierra automáticamente tras inactividad.",
    icon: Shield,
    settings: [
      { label: "Sesiones simultáneas", value: "2 por usuario", tooltip: "Permite usar el sistema en dos dispositivos a la vez (ej. escritorio y móvil)" },
      { label: "Timeout inactividad", value: "30 minutos", recommended: true },
      { label: "Bloqueo temporal", value: "15 minutos", tooltip: "Tiempo de bloqueo tras reintentos fallidos" },
    ],
  },
  {
    id: "audit",
    title: "Auditoría",
    description: "Registro y retención de eventos",
    tooltip: "Configura cuánto tiempo se conservan los logs y qué información se registra.",
    icon: FileText,
    settings: [
      { label: "Retención de logs", value: "365 días", recommended: true },
      { label: "Registro de IP", value: "Habilitado" },
      { label: "Exportación", value: "CSV, Excel" },
    ],
  },
];

function exportToCSV(data: AuditLogEntry[]) {
  const headers = ["Usuario", "Acción", "Detalle", "Fecha", "IP", "Tipo"];
  const rows = data.map((r) =>
    [r.usuario, r.accion, r.detalle, r.fecha, r.ip, r.tipo].join(",")
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

const PAGE_SIZE = 5;
const QUICK_FILTERS = [
  { id: "24h", label: "Últimas 24h", hours: 24 },
  { id: "week", label: "Esta semana", days: 7 },
  { id: "month", label: "Este mes", days: 30 },
];

export function Settings() {
  const [roles, setRoles] = useState(initialRoles);
  const [users, setUsers] = useState(initialUsersData);
  const [userSearch, setUserSearch] = useState("");
  const [auditFilterUser, setAuditFilterUser] = useState("all");
  const [auditFilterType, setAuditFilterType] = useState("all");
  const [auditSearch, setAuditSearch] = useState("");
  const [auditDateFrom, setAuditDateFrom] = useState("");
  const [auditDateTo, setAuditDateTo] = useState("");
  const [auditQuickFilter, setAuditQuickFilter] = useState<string | null>(null);
  const [auditSortBy, setAuditSortBy] = useState<"fecha" | "usuario" | "tipo">("fecha");
  const [auditSortDir, setAuditSortDir] = useState<"asc" | "desc">("desc");
  const [auditPage, setAuditPage] = useState(0);
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState<number | null>(null);
  const [newUser, setNewUser] = useState({ nombre: "", correo: "", rol: "Cajero", estado: "Activo" });
  const [expandedRoles, setExpandedRoles] = useState<string[]>(["admin"]);

  const roleNames = roles.map((r) => r.name);

  const handleUserRoleChange = (userId: number, newRol: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              rol: newRol,
              permisos:
                newRol === "Administrador"
                  ? ["Todo"]
                  : ["Ventas", "Ver Inventario"],
            }
          : u
      )
    );
  };

  const handleSaveRoles = () => {
    setHasUnsavedChanges(false);
    toast.success("Cambios en roles guardados correctamente");
  };

  const filteredUsers = users.filter(
    (u) =>
      !userSearch ||
      u.nombre.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.correo.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.rol.toLowerCase().includes(userSearch.toLowerCase())
  );

  const getActionBadge = (tipo: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      delete: { variant: "destructive", label: "Eliminación" },
      edit: { variant: "default", label: "Modificación" },
      create: { variant: "default", label: "Creación" },
      sale: { variant: "default", label: "Venta" },
      import: { variant: "default", label: "Importación" },
      login: { variant: "secondary", label: "Login" },
    };
    const config = variants[tipo] || { variant: "secondary" as const, label: tipo };
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  const now = Date.now();
  const getQuickFilterRange = () => {
    if (!auditQuickFilter) return { from: 0, to: now };
    const f = QUICK_FILTERS.find((q) => q.id === auditQuickFilter);
    if (!f) return { from: 0, to: now };
    if ("hours" in f) return { from: now - f.hours * 60 * 60 * 1000, to: now };
    return { from: now - (f.days || 30) * 24 * 60 * 60 * 1000, to: now };
  };

  const filteredAudit = auditLogData
    .filter((log) => {
      const matchUser = auditFilterUser === "all" || log.usuario === auditFilterUser;
      const matchType = auditFilterType === "all" || log.tipo === auditFilterType;
      const matchSearch =
        !auditSearch ||
        log.usuario.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.accion.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.detalle.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.ip.includes(auditSearch);
      const { from: qFrom, to: qTo } = getQuickFilterRange();
      const matchDateRange =
        (!auditDateFrom || log.timestamp >= new Date(auditDateFrom).getTime()) &&
        (!auditDateTo || log.timestamp <= new Date(auditDateTo + "T23:59:59").getTime()) &&
        (auditQuickFilter ? log.timestamp >= qFrom && log.timestamp <= qTo : true);
      return matchUser && matchType && matchSearch && matchDateRange;
    })
    .sort((a, b) => {
      const mult = auditSortDir === "asc" ? 1 : -1;
      if (auditSortBy === "fecha") return (a.timestamp - b.timestamp) * mult;
      if (auditSortBy === "usuario") return (a.usuario.localeCompare(b.usuario)) * mult;
      return (a.tipo.localeCompare(b.tipo)) * mult;
    });

  const paginatedAudit = filteredAudit.slice(
    auditPage * PAGE_SIZE,
    (auditPage + 1) * PAGE_SIZE
  );
  const totalPages = Math.ceil(filteredAudit.length / PAGE_SIZE);

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
    setExpandedRoles((p) => [...p, id]);
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
    setHasUnsavedChanges(true);
  };

  const toggleRoleExpand = (roleId: string) => {
    setExpandedRoles((p) =>
      p.includes(roleId) ? p.filter((id) => id !== roleId) : [...p, roleId]
    );
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        if (hasUnsavedChanges) handleSaveRoles();
      }
    },
    [hasUnsavedChanges]
  );

  const handleAddUser = () => {
    if (!newUser.nombre.trim() || !newUser.correo.trim()) return;
    const id = Math.max(...users.map((u) => u.id), 0) + 1;
    const nombre = newUser.nombre;
    setUsers([
      ...users,
      {
        id,
        nombre: newUser.nombre,
        correo: newUser.correo,
        rol: newUser.rol,
        permisos: newUser.rol === "Administrador" ? ["Todo"] : ["Ventas", "Ver Inventario"],
        estado: newUser.estado,
      },
    ]);
    setNewUser({ nombre: "", correo: "", rol: "Cajero", estado: "Activo" });
    setNewUserOpen(false);
    toast.success(`Usuario "${nombre}" creado`);
  };

  const editingUser = editUserOpen ? users.find((u) => u.id === editUserOpen) : null;

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const uniqueUsers = [...new Set(auditLogData.map((l) => l.usuario))];
  const uniqueTypes = [...new Set(auditLogData.map((l) => l.tipo))];

  return (
    <TooltipProvider>
      <div className="p-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Configuración y Seguridad
            </h1>
            <p className="text-gray-500 mt-2">
              Gestiona usuarios, roles, políticas de seguridad y auditoría
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                ¿Cómo funciona?
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="font-medium mb-1">Ayuda rápida</p>
              <p className="text-sm">Usa Ctrl+S para guardar cambios en roles. Los filtros de la bitácora permiten exportar solo lo que necesitas.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tabs defaultValue="usuarios-roles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="usuarios-roles" className="gap-2">
              <UserCog className="w-4 h-4" />
              Usuarios y Roles
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="gap-2">
              <Activity className="w-4 h-4" />
              Bitácora de Actividad
            </TabsTrigger>
            <TabsTrigger value="politicas" className="gap-2">
              <Lock className="w-4 h-4" />
              Políticas de Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Usuarios y Roles */}
          <TabsContent value="usuarios-roles" className="space-y-6">
            {hasUnsavedChanges && (
              <Card className="p-4 bg-amber-50 border-amber-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-amber-900">Hay cambios sin guardar</p>
                  <p className="text-sm text-amber-800">Presiona Ctrl+S o el botón Guardar para aplicar los cambios.</p>
                </div>
                <Button size="sm" onClick={handleSaveRoles}>
                  Guardar ahora
                </Button>
              </Card>
            )}

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900">Acceso Jerárquico</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Los roles definen el nivel de acceso. Admin tiene control total. Cajero opera ventas e inventario.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-between mb-4">
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
                    <DialogDescription>Define un rol con nombre y descripción.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Nombre del rol</Label>
                      <Input placeholder="Ej: Supervisor" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Descripción</Label>
                      <Input placeholder="Descripción del rol..." value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewRoleOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddRole} disabled={!newRoleName.trim()}>Crear Rol</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Acordeón de Roles - borde y scroll solo si hay más de 5 */}
            <div
              className={`space-y-2 ${roles.length > 5 ? "max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50 p-2" : ""}`}
            >
              {roles.map((role) => {
                const Icon = role.icon;
                const isOpen = expandedRoles.includes(role.id);
                const colorClass =
                  role.color === "purple"
                    ? "bg-purple-100 text-purple-600"
                    : role.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : role.color === "green"
                        ? "bg-green-100 text-green-600"
                        : role.color === "amber"
                          ? "bg-amber-100 text-amber-600"
                          : role.color === "teal"
                            ? "bg-teal-100 text-teal-600"
                            : role.color === "indigo"
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-gray-100 text-gray-600";
                return (
                  <Collapsible
                    key={role.id}
                    open={isOpen}
                    onOpenChange={() => toggleRoleExpand(role.id)}
                  >
                    <Card>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors">
                          <ChevronRight
                            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-90" : ""}`}
                          />
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-semibold">{role.name}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{role.description}</p>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <Info className="w-4 h-4 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">{role.description}</TooltipContent>
                          </Tooltip>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-t px-4 py-4 space-y-4">
                          <p className="text-sm font-medium text-gray-700">Permisos:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {permissions.map((perm) => (
                              <div key={perm.id} className="flex items-center justify-between">
                                <Label htmlFor={`${role.id}-${perm.id}`} className="text-sm">
                                  {perm.label}
                                </Label>
                                <Switch
                                  id={`${role.id}-${perm.id}`}
                                  checked={role.permissions.includes(perm.id)}
                                  onCheckedChange={() => togglePermission(role.id, perm.id)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveRoles} disabled={!hasUnsavedChanges}>
                Guardar Cambios en Roles
              </Button>
            </div>

            {/* Tabla de Usuarios */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Usuarios del Sistema</h3>
                  <p className="text-sm text-gray-500 mt-1">Usuarios asignados a cada rol</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-full md:w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre, correo o rol..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Agregar Usuario
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nuevo Usuario</DialogTitle>
                        <DialogDescription>
                          Agregar un usuario al sistema. Asigna nombre, correo y rol.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Nombre</Label>
                          <Input
                            placeholder="Ej: Juan Pérez"
                            value={newUser.nombre}
                            onChange={(e) => setNewUser((p) => ({ ...p, nombre: e.target.value }))}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Correo electrónico</Label>
                          <Input
                            type="email"
                            placeholder="usuario@empresa.com"
                            value={newUser.correo}
                            onChange={(e) => setNewUser((p) => ({ ...p, correo: e.target.value }))}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Rol</Label>
                          <Select value={newUser.rol} onValueChange={(v) => setNewUser((p) => ({ ...p, rol: v }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roleNames.map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Estado</Label>
                          <Select value={newUser.estado} onValueChange={(v) => setNewUser((p) => ({ ...p, estado: v }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Activo">Activo</SelectItem>
                              <SelectItem value="Inactivo">Inactivo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewUserOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddUser} disabled={!newUser.nombre.trim() || !newUser.correo.trim()}>
                          Crear Usuario
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <UserCog className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No hay usuarios que coincidan</p>
                  <p className="text-sm mt-1">Ajusta el filtro de búsqueda o agrega un nuevo usuario.</p>
                </div>
              ) : (
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
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nombre}</TableCell>
                        <TableCell className="text-gray-600">{user.correo}</TableCell>
                        <TableCell>
                          <Select
                            value={user.rol}
                            onValueChange={(v) => handleUserRoleChange(user.id, v)}
                          >
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roleNames.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.permisos.slice(0, 2).map((p, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {p}
                              </Badge>
                            ))}
                            {user.permisos.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{user.permisos.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.estado === "Activo" ? "default" : "secondary"}>{user.estado}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setEditUserOpen(user.id)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar usuario</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Ver detalle</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            {/* Modal Editar Usuario */}
            {editingUser && (
              <Dialog open={!!editUserOpen} onOpenChange={(o) => !o && setEditUserOpen(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>
                      Modificar datos del usuario {editingUser.nombre}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Nombre</Label>
                      <Input defaultValue={editingUser.nombre} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Correo</Label>
                      <Input type="email" defaultValue={editingUser.correo} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Rol</Label>
                      <Select defaultValue={editingUser.rol}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleNames.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Estado</Label>
                      <Select defaultValue={editingUser.estado}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditUserOpen(null)}>Cancelar</Button>
                    <Button onClick={() => { setEditUserOpen(null); toast.success("Usuario actualizado"); }}>
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Bitácora de Actividad */}
          <TabsContent value="auditoria" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Historial de Auditoría</h3>
                <p className="text-sm text-gray-500 mt-1">Registro de acciones con filtros y exportación</p>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar..." value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)} className="pl-9" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {QUICK_FILTERS.map((q) => (
                    <Button
                      key={q.id}
                      variant={auditQuickFilter === q.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAuditQuickFilter(auditQuickFilter === q.id ? null : q.id)}
                    >
                      {q.label}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    type="date"
                    value={auditDateFrom}
                    onChange={(e) => setAuditDateFrom(e.target.value)}
                    className="w-[140px]"
                  />
                  <span className="text-gray-400">—</span>
                  <Input
                    type="date"
                    value={auditDateTo}
                    onChange={(e) => setAuditDateTo(e.target.value)}
                    className="w-[140px]"
                  />
                </div>
                <Select value={auditFilterUser} onValueChange={setAuditFilterUser}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueUsers.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={auditFilterType} onValueChange={setAuditFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t === "delete" ? "Eliminación" : t === "edit" ? "Modificación" : t === "create" ? "Creación" : t === "sale" ? "Venta" : t === "import" ? "Importación" : t === "login" ? "Login" : t}
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
                    <DropdownMenuItem onClick={handleExportCSV}>Exportar como CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Exportación Excel en desarrollo")}>Exportar como Excel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:underline"
                        onClick={() => {
                          setAuditSortBy("usuario");
                          setAuditSortDir((d) => (auditSortBy === "usuario" && d === "desc" ? "asc" : "desc"));
                        }}
                      >
                        Usuario {auditSortBy === "usuario" && (auditSortDir === "asc" ? "↑" : "↓")}
                      </button>
                    </TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:underline"
                        onClick={() => {
                          setAuditSortBy("fecha");
                          setAuditSortDir((d) => (auditSortBy === "fecha" && d === "asc" ? "desc" : "asc"));
                        }}
                      >
                        Fecha {auditSortBy === "fecha" && (auditSortDir === "asc" ? "↑" : "↓")}
                      </button>
                    </TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:underline"
                        onClick={() => {
                          setAuditSortBy("tipo");
                          setAuditSortDir((d) => (auditSortBy === "tipo" && d === "desc" ? "asc" : "desc"));
                        }}
                      >
                        Tipo {auditSortBy === "tipo" && (auditSortDir === "asc" ? "↑" : "↓")}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAudit.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.usuario}</TableCell>
                      <TableCell>{log.accion}</TableCell>
                      <TableCell className="max-w-md text-gray-600">{log.detalle}</TableCell>
                      <TableCell className="text-gray-600">{log.fecha}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-500">{log.ip}</TableCell>
                      <TableCell>{getActionBadge(log.tipo)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredAudit.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No hay registros que coincidan</p>
                  <p className="text-sm mt-1">Ajusta los filtros o el rango de fechas.</p>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    Mostrando {auditPage * PAGE_SIZE + 1}-{Math.min((auditPage + 1) * PAGE_SIZE, filteredAudit.length)} de {filteredAudit.length}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={auditPage === 0}
                      onClick={() => setAuditPage((p) => p - 1)}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={auditPage >= totalPages - 1}
                      onClick={() => setAuditPage((p) => p + 1)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Políticas de Seguridad */}
          <TabsContent value="politicas" className="space-y-6">
            <p className="text-sm text-gray-600">
              Reglas de seguridad aplicadas al sistema. Estas políticas protegen el acceso y registran la actividad.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {securityPolicies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <Card key={policy.id} className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{policy.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{policy.description}</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 mt-1 p-0">
                              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">{policy.tooltip}</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {policy.settings.map((s) => (
                        <div key={s.label} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">{s.label}</span>
                            {s.tooltip && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-3 h-3 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>{s.tooltip}</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <span className="flex items-center gap-1">
                            {s.value}
                            {s.recommended && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0">Recomendado</Badge>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
