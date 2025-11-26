import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Save, Package } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
    { value: "vegetables", label: "Vegetables 🥬" },
    { value: "fruits", label: "Fruits 🍎" },
    { value: "dairy", label: "Dairy 🧀" },
    { value: "meat", label: "Meat 🥩" },
    { value: "grains", label: "Grains 🌾" },
    { value: "spices", label: "Spices 🌶️" },
    { value: "canned", label: "Canned 🥫" },
    { value: "frozen", label: "Frozen ❄️" },
    { value: "beverages", label: "Beverages 🥤" },
    { value: "snacks", label: "Snacks 🍪" },
    { value: "condiments", label: "Condiments 🍯" },
    { value: "other", label: "Other 📦" }
];
  
const units = [
    { value: "pieces", label: "Pieces" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "g", label: "Grams (g)" },
    { value: "l", label: "Liters (l)" },
    { value: "ml", label: "Milliliters (ml)" },
    { value: "cups", label: "Cups" },
    { value: "tbsp", label: "Tablespoons" },
    { value: "tsp", label: "Teaspoons" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "lbs", label: "Pounds (lbs)" },
    { value: "cans", label: "Cans" },
    { value: "bottles", label: "Bottles" }
];
  
const locations = [
    { value: "fridge", label: "Fridge ❄️" },
    { value: "pantry", label: "Pantry 🏠" },
    { value: "freezer", label: "Freezer 🧊" },
    { value: "cabinet", label: "Cabinet 🗄️" },
    { value: "counter", label: "Counter 🔢" }
];

export default function EditItemModal({ isOpen, onClose, item, onSave }) {
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (item) {
            const formattedDate = item.expiry_date ? new Date(item.expiry_date).toISOString().split('T')[0] : "";
            setFormData({ ...item, expiry_date: formattedDate });
        } else {
            setFormData(null);
        }
    }, [item]);

    if (!formData) return null;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await onSave(item.id, {
            ...formData,
            quantity: parseFloat(formData.quantity)
        });
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white/80 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Package className="w-5 h-5 text-green-500" />
                        Edit Item
                    </DialogTitle>
                    <DialogDescription>
                        Update the details for "{item.name}".
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Item Name *</Label>
                            <Input id="edit-name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                                <SelectTrigger id="edit-category"><SelectValue /></SelectTrigger>
                                <SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-quantity">Quantity *</Label>
                            <Input id="edit-quantity" type="number" min="0" step="0.1" value={formData.quantity} onChange={(e) => handleInputChange("quantity", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-unit">Unit *</Label>
                            <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)} required>
                                <SelectTrigger id="edit-unit"><SelectValue /></SelectTrigger>
                                <SelectContent>{units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-expiry_date">Expiry Date *</Label>
                            <Input id="edit-expiry_date" type="date" value={formData.expiry_date} onChange={(e) => handleInputChange("expiry_date", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-location">Storage Location *</Label>
                            <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)} required>
                                <SelectTrigger id="edit-location"><SelectValue /></SelectTrigger>
                                <SelectContent>{locations.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea id="edit-notes" value={formData.notes || ''} onChange={(e) => handleInputChange("notes", e.target.value)} />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                            {isLoading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}