import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, UserCircle, MapPin, CreditCard, Lock, Mail, Store, Truck, ChevronDown } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DELIVERY_ZONES = [
  { id: '1', name: 'Altamira', price: 3 },
  { id: '2', name: 'Chacao', price: 2 },
  { id: '3', name: 'Las Mercedes', price: 4 },
  { id: '4', name: 'El Hatillo', price: 6 },
  { id: '5', name: 'Otra zona (Acordar con vendedor)', price: 0 },
];

export default function Checkout() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  // Checkout States
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  
  // Base checkout subtotal mocked (Cart context ideally handles this)
  const orderSubtotal = 34.00;
  
  const deliveryFee = useMemo(() => {
    if (deliveryMethod === 'pickup') return 0;
    const zone = DELIVERY_ZONES.find(z => z.id === selectedZoneId);
    return zone ? zone.price : 0;
  }, [deliveryMethod, selectedZoneId]);
  
  const orderTotal = orderSubtotal + deliveryFee;

  // Pre-fill delivery zone based on user's location if it matches partially
  useEffect(() => {
    if (user && user.ubicacionCorta && !selectedZoneId) {
      const match = DELIVERY_ZONES.find(z => user.ubicacionCorta.toLowerCase().includes(z.name.toLowerCase()));
      if (match) setSelectedZoneId(match.id);
    }
  }, [user, selectedZoneId]);

  // Dummy State for Form Simulation
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', cedula: '', ubicacionCorta: '', telefono: '', fechaNacimiento: '', email: '', password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      login(formData);
    } else {
      // Mock Login
      login({
        nombre: 'Valeria',
        apellido: 'Gómez',
        cedula: 'V-20123456',
        ubicacionCorta: 'Altamira, Caracas',
        telefono: '+58 412 000 0000',
        fechaNacimiento: '1995-10-14',
        email: formData.email || 'valeria@ejemplo.com'
      });
    }
  };

  const handleCheckoutSubmit = () => {
    // Navigate home or to success success screen
    alert("¡Pedido realizado con éxito!");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="pt-24 md:pt-32 pb-24 min-h-screen bg-brand-cream border-t border-brand-dark/10">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Link to="/carrito" className="inline-flex items-center space-x-2 text-brand-dark/60 hover:text-brand-hotpink mb-8 transition-colors">
            <ArrowLeft size={16} />
            <span className="font-sans font-bold text-xs tracking-[0.2em] uppercase">Volver al carrito</span>
          </Link>

          <div className="bg-white rounded-[2rem] border-2 border-brand-dark/10 shadow-[6px_6px_0px_0px_rgba(26,29,46,0.05)] overflow-hidden">
            <div className="flex border-b-2 border-brand-dark/10 relative">
              {/* Tab Selector */}
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-4 md:py-6 font-display font-black text-xl md:text-2xl uppercase tracking-widest transition-colors ${authMode === 'login' ? 'text-brand-hotpink' : 'text-brand-dark/40 hover:text-brand-dark/70'}`}
              >
                Inicia Sesión
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-4 md:py-6 font-display font-black text-xl md:text-2xl uppercase tracking-widest transition-colors ${authMode === 'register' ? 'text-brand-hotpink' : 'text-brand-dark/40 hover:text-brand-dark/70'}`}
              >
                Regístrate
              </button>
              {/* Active Underline */}
              <motion.div 
                className="absolute bottom-0 h-1 bg-brand-hotpink" 
                initial={false} 
                animate={{ left: authMode === 'login' ? '0%' : '50%', width: '50%' }} 
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            <div className="p-6 md:p-12">
              <p className="text-brand-dark/80 font-sans text-xs md:text-sm font-medium mb-6 md:mb-8 text-center max-w-md mx-auto">
                {authMode === 'login' 
                  ? 'Bienvenido de vuelta. Identifícate para continuar con tu pedido súper rápido.' 
                  : 'Crea tu cuenta de La Lune una sola vez y nunca más repitas tus datos. Tú te enfocas en el antojo, nosotros del resto.'}
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-6 max-w-2xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {authMode === 'register' && (
                    <motion.div 
                      key="register-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-sans font-bold text-[10px] uppercase tracking-widest text-brand-dark/80 mb-2">Nombre</label>
                          <input required type="text" name="nombre" onChange={handleInputChange} className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl px-4 py-3 outline-none focus:border-brand-hotpink transition-colors font-medium text-brand-dark placeholder:text-brand-dark/40" placeholder="Escribe tu nombre" />
                        </div>
                        <div>
                          <label className="block font-sans font-bold text-[10px] uppercase tracking-widest text-brand-dark/80 mb-2">Apellido</label>
                          <input required type="text" name="apellido" onChange={handleInputChange} className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl px-4 py-3 outline-none focus:border-brand-hotpink transition-colors font-medium text-brand-dark placeholder:text-brand-dark/40" placeholder="Escribe tu apellido" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-sans font-bold text-[10px] uppercase tracking-widest text-brand-dark/80 mb-2">Cédula</label>
                          <input required type="text" name="cedula" onChange={handleInputChange} className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl px-4 py-3 outline-none focus:border-brand-hotpink transition-colors font-medium text-brand-dark placeholder:text-brand-dark/40" placeholder="V- / E-" />
                        </div>
                        <div>
                          <label className="block font-sans font-bold text-[10px] uppercase tracking-widest text-brand-dark/80 mb-2">Fecha de Nacimiento</label>
                          <input required type="date" name="fechaNacimiento" onChange={handleInputChange} className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl px-4 py-3 outline-none focus:border-brand-hotpink transition-colors font-medium text-brand-dark" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-sans font-bold text-[10px] uppercase tracking-widest text-brand-dark/80 mb-2">Ubicación Corta (Sector, Zona)</label>
                        <input 
                          required 
                          type="text" 
                          name="ubicacionCorta" 
                          list="zonas-list"
                          onChange={handleInputChange} 
                          className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl px-4 py-3 outline-none focus:border-brand-hotpink transition-colors font-medium text-brand-dark placeholder:text-brand-dark/40" 
                          placeholder="Busca o escribe tu zona..." 
                        />
                        <datalist id="zonas-list">
                          {DELIVERY_ZONES.map(z => (
                            <option key={z.id} value={z.name} />
                          ))}
                        </datalist>
                      </div>
                      
                      <div>
                        <label className="block font-sans font-bold text-[10px] uppercase tracking-widest text-brand-dark/80 mb-2">Teléfono</label>
                        <input required type="tel" name="telefono" onChange={handleInputChange} className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl px-4 py-3 outline-none focus:border-brand-hotpink transition-colors font-medium text-brand-dark placeholder:text-brand-dark/40" placeholder="+58 000 000 0000" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block font-sans font-bold text-[10px] uppercase tracking-widest text-brand-dark/80 mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/80" />
                    <input required type="email" name="email" onChange={handleInputChange} className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-hotpink transition-colors font-medium text-brand-dark placeholder:text-brand-dark/50" placeholder="tu@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block font-sans font-bold text-[10px] uppercase tracking-widest text-brand-dark/80 mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/80" />
                    <input required type="password" name="password" onChange={handleInputChange} className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-hotpink transition-colors font-medium text-brand-dark placeholder:text-brand-dark/50" placeholder="••••••••" />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full mt-4 bg-brand-hotpink text-white rounded-xl py-4 font-bold text-sm tracking-[0.2em] uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors shadow-[0_4px_14px_0_rgba(213,63,140,0.39)]"
                >
                  {authMode === 'login' ? 'Entrar y Continuar' : 'Crear Cuenta y Continuar'}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN CHECKOUT VIEW
  return (
    <div className="pt-24 md:pt-32 pb-24 min-h-screen bg-brand-cream border-t border-brand-dark/10">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        <Link to="/carrito" className="inline-flex items-center space-x-2 text-brand-dark/60 hover:text-brand-hotpink mb-6 md:mb-8 transition-colors">
          <ArrowLeft size={14} className="md:w-4 md:h-4" />
          <span className="font-sans font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase">Volver al carrito</span>
        </Link>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-8 md:mb-10">
          <h1 className="font-display font-black text-3xl md:text-5xl text-brand-dark uppercase tracking-tight">Checkout</h1>
          
          <div className="flex items-center space-x-3 bg-white px-3 md:px-4 py-2 rounded-full border-2 border-brand-dark/10 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-brand-lavender text-brand-dark flex items-center justify-center font-bold">
              {user.nombre.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-brand-dark/50 font-bold leading-none">Conectado como</span>
              <span className="text-sm font-bold text-brand-dark leading-snug">{user.nombre} {user.apellido}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10">
          <div className="lg:col-span-3 space-y-4 md:space-y-8">
            {/* Delivery/Pickup Selector */}
            <div className="bg-white p-5 md:p-8 rounded-[2rem] border-2 border-brand-dark/10 shadow-[4px_4px_0px_0px_rgba(26,29,46,0.03)] md:shadow-[6px_6px_0px_0px_rgba(26,29,46,0.05)] relative overflow-hidden">
              <h2 className="font-display font-black text-xl md:text-2xl mb-4 md:mb-6">Método de Entrega</h2>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                <button 
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl md:rounded-[24px] transition-all duration-300 ${deliveryMethod === 'pickup' ? 'bg-brand-dark border-brand-dark text-white shadow-[4px_4px_0px_0px_rgba(26,29,46,1)]' : 'bg-transparent border-brand-dark/20 text-brand-dark hover:border-brand-dark'}`}
                >
                  <Store size={24} className="mb-2" />
                  <span className="font-sans font-bold text-xs md:text-sm tracking-widest uppercase">Pick Up</span>
                </button>
                <button 
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl md:rounded-[24px] transition-all duration-300 ${deliveryMethod === 'delivery' ? 'bg-brand-dark border-brand-dark text-white shadow-[4px_4px_0px_0px_rgba(26,29,46,1)]' : 'bg-transparent border-brand-dark/20 text-brand-dark hover:border-brand-dark'}`}
                >
                  <Truck size={24} className="mb-2" />
                  <span className="font-sans font-bold text-xs md:text-sm tracking-widest uppercase">Delivery</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {deliveryMethod === 'delivery' ? (
                  <motion.div 
                    key="delivery"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 md:space-y-5 relative z-10"
                  >
                    <div className="w-full h-px bg-brand-dark/10 mb-4 md:mb-6"></div>
                    <h3 className="font-sans font-black text-sm md:text-base text-brand-dark tracking-widest uppercase mb-3 text-left">Datos de Envío</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="bg-brand-cream/30 p-1 rounded-xl border-2 border-brand-dark/10 relative text-left">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] md:text-[10px] text-brand-dark uppercase tracking-widest font-black">Nombre</span>
                        <input type="text" defaultValue={`${user.nombre} ${user.apellido}`} className="w-full bg-transparent px-3 py-2 outline-none text-xs md:text-sm text-brand-dark font-black" />
                      </div>
                      <div className="bg-brand-cream/30 p-1 rounded-xl border-2 border-brand-dark/10 relative text-left">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] md:text-[10px] text-brand-dark uppercase tracking-widest font-black">Teléfono</span>
                        <input type="text" defaultValue={user.telefono} className="w-full bg-transparent px-3 py-2 outline-none text-xs md:text-sm text-brand-dark font-black" />
                      </div>
                    </div>
                    
                    <div className="bg-brand-cream/30 rounded-xl border-2 border-brand-dark/10 relative text-left">
                      <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] md:text-[10px] text-brand-dark uppercase tracking-widest font-black z-10">Zona de Delivery</span>
                      <select 
                        value={selectedZoneId}
                        onChange={(e) => setSelectedZoneId(e.target.value)}
                        className="w-full bg-transparent px-4 py-3 md:py-4 outline-none text-xs md:text-sm text-brand-dark font-black appearance-none relative z-0 cursor-pointer"
                      >
                        <option value="" disabled className="text-brand-dark font-black">Selecciona tu zona...</option>
                        {DELIVERY_ZONES.map(z => (
                          <option key={z.id} value={z.id} className="text-brand-dark bg-white font-black">{z.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/80 pointer-events-none" />
                    </div>

                    <div className="pt-1 text-left">
                      <input type="text" defaultValue={user.ubicacionCorta} className="w-full bg-brand-cream/30 border-2 border-brand-dark/10 rounded-xl px-4 py-3 md:py-4 outline-none focus:border-brand-hotpink transition-colors font-black text-xs md:text-sm text-brand-dark placeholder:text-brand-dark/60" placeholder="Dirección exacta o referencia..." />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="pickup"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-brand-cream/40 p-4 md:p-5 rounded-2xl border-2 border-brand-dark/5 text-left"
                  >
                    <div className="flex items-start space-x-3 text-brand-dark/80">
                      <Store size={20} className="shrink-0 mt-0.5 text-brand-hotpink" />
                      <p className="font-bold text-xs md:text-sm leading-relaxed text-brand-dark">
                        Retira tu pedido directamente en nuestra sede.<br />
                        <span className="text-brand-pink font-black mt-1 block">Te notificaremos cuando esté listo.</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-5 md:p-8 rounded-[2rem] border-2 border-brand-dark/10 shadow-[4px_4px_0px_0px_rgba(26,29,46,0.03)] md:shadow-[6px_6px_0px_0px_rgba(26,29,46,0.05)]">
              <h2 className="font-display font-black text-xl md:text-2xl mb-4 md:mb-6">Método de Pago</h2>
              
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center space-x-3 p-3 md:p-4 border-2 border-brand-hotpink bg-brand-hotpink/5 rounded-xl cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="text-brand-hotpink focus:ring-brand-hotpink" />
                  <div className="flex-1 text-left">
                    <span className="block font-bold text-sm md:text-base text-brand-dark">Pago Móvil / Transferencia</span>
                    <span className="text-[10px] md:text-xs text-brand-dark/60 font-medium">Banesco, Mercantil (Bs)</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-3 md:p-4 border-2 border-brand-dark/10 hover:border-brand-dark/30 rounded-xl cursor-pointer transition-colors">
                  <input type="radio" name="payment" className="text-brand-hotpink focus:ring-brand-hotpink" />
                  <div className="flex-1 text-left">
                    <span className="block font-bold text-sm md:text-base text-brand-dark">Zelle / Efectivo</span>
                    <span className="text-[10px] md:text-xs text-brand-dark/60 font-medium">USD</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Confirm Pane */}
          <div className="lg:col-span-2 text-left">
            <div className="bg-brand-dark text-white p-6 md:p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(213,63,140,1)] md:sticky md:top-32">
              <div className="mb-4 text-white/70 text-[10px] tracking-widest uppercase font-black flex justify-between items-end border-b border-white/10 pb-2">
                <span>Resumen de Compra</span>
                <span className="font-bold text-white">3 items</span>
              </div>
              
              <div className="space-y-3 mb-6 md:mb-8 border-b border-white/10 pb-4 md:pb-6">
                <div className="flex justify-between items-center text-xs md:text-sm text-white font-black">
                   <span>Subtotal del pedido</span>
                   <span className="text-white font-bold">${orderSubtotal.toFixed(2)}</span>
                </div>
                {deliveryMethod === 'delivery' && (
                  <div className="flex justify-between items-center text-xs md:text-sm text-white font-black opacity-90 transition-all">
                     <span>Delivery <span className="opacity-70 text-[10px] uppercase">({DELIVERY_ZONES.find(z => z.id === selectedZoneId)?.name || 'Sin seleccionar'})</span></span>
                     <span className="text-brand-pink font-bold">${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-6 md:mb-8">
                <div>
                  <span className="block text-brand-hotpink text-[9px] md:text-[10px] tracking-widest font-black uppercase mb-1">Total a Pagar</span>
                  <span className="font-display font-black text-3xl md:text-4xl text-white">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {deliveryMethod === 'delivery' && selectedZoneId !== '' && (
                <div className="space-y-4 mb-6 md:mb-8">
                  <div className="flex items-start space-x-2 md:space-x-3 text-xs md:text-sm text-white/90">
                    <CheckCircle2 size={16} className="text-brand-hotpink shrink-0 mt-0.5 md:w-[18px] md:h-[18px]" />
                    <span className="font-bold">Tu perfil ya ahorró pasos hoy. Tu orden va para <b>{user.ubicacionCorta}</b>.</span>
                  </div>
                </div>
              )}

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckoutSubmit}
                // disabled if delivery chosen but zone not picked
                disabled={deliveryMethod === 'delivery' && !selectedZoneId}
                className={`w-full text-white rounded-full py-4 md:py-5 px-6 font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase transition-colors shadow-[0_4px_14px_0_rgba(213,63,140,0.39)] ${
                  deliveryMethod === 'delivery' && !selectedZoneId 
                  ? 'bg-brand-dark/50 text-white/40 cursor-not-allowed border border-white/10 shadow-none' 
                  : 'bg-brand-hotpink hover:bg-white hover:text-brand-dark'
                }`}
              >
                Completar Pedido
              </motion.button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
