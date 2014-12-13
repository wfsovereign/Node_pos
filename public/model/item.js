function Item(barcode, name, unit, price,category) {
    this.barcode = barcode;
    this.name = name;
    this.unit = unit;
    this.price = price || 0.00;
    this.category = category;
}