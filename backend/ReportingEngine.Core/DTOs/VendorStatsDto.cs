namespace ReportingEngine.Core.DTOs
{
    /// <summary>
    /// Represents a vendor statistic field that can be dragged to the report builder
    /// </summary>
    public class VendorStatsDto
    {
        public string FieldName { get; set; } = string.Empty; // "VendorName", "Address", "PhoneNumber"
        public string DisplayName { get; set; } = string.Empty; // "Vendor Name", "Address", "Phone Number"
        public string DragType => "vendor-stat";
    }
}
