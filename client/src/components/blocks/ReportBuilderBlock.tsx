import { useState } from 'react';
import { Download, FileSpreadsheet, Trash2, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ReportColumn {
    type: 'vendor-stat' | 'question';
    fieldName?: string;
    displayName: string;
    questionId?: number;
}

interface ReportBuilderBlockProps {
    clientId: number | null;
}

export default function ReportBuilderBlock({ clientId }: ReportBuilderBlockProps) {
    const [columns, setColumns] = useState<ReportColumn[]>([]);
    const [reportData, setReportData] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-primary', 'bg-primary/5');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-primary', 'bg-primary/5');

        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));

            // Check if column already exists
            const exists = columns.some(col =>
                col.type === data.type &&
                (data.type === 'vendor-stat' ? col.fieldName === data.fieldName : col.questionId === data.questionId)
            );

            if (exists) {
                toast({
                    title: 'Column already added',
                    description: 'This field is already in your report.',
                    variant: 'destructive',
                });
                return;
            }

            const newColumn: ReportColumn = {
                type: data.type,
                displayName: data.displayName || data.text,
                ...(data.type === 'vendor-stat' && { fieldName: data.fieldName }),
                ...(data.type === 'question' && { questionId: data.id }),
            };

            setColumns([...columns, newColumn]);
            toast({
                title: 'Column added',
                description: `Added "${newColumn.displayName}" to report.`,
            });
        } catch (error) {
            console.error('Error parsing drop data:', error);
        }
    };

    const removeColumn = (index: number) => {
        setColumns(columns.filter((_, i) => i !== index));
    };

    const clearAll = () => {
        setColumns([]);
        setReportData(null);
        setShowReportDialog(false);
    };

    const generateReport = async () => {
        if (!clientId) {
            toast({
                title: 'No client selected',
                description: 'Please select a client first.',
                variant: 'destructive',
            });
            return;
        }

        if (columns.length === 0) {
            toast({
                title: 'No columns selected',
                description: 'Please drag some fields to the report builder first.',
                variant: 'destructive',
            });
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch(`http://localhost:5008/api/reports/generate?clientId=${clientId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(columns.map(col => ({
                    type: col.type,
                    questionId: col.questionId,
                    fieldName: col.fieldName,
                    displayName: col.displayName,
                }))),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setReportData(data);
            setShowReportDialog(true); // Show the dialog popup

            toast({
                title: 'Report generated successfully',
                description: `Generated report with ${columns.length} columns and ${data.rows?.length || 0} rows.`,
            });
        } catch (error) {
            console.error('Error generating report:', error);
            toast({
                title: 'Error generating report',
                description: error instanceof Error ? error.message : 'Failed to generate report. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const exportToExcel = async () => {
        if (!reportData) {
            toast({
                title: 'No report data',
                description: 'Please generate a report first.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:5008/api/reports/export/excel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Download the Excel file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dynamic_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: 'Export successful',
                description: 'Report exported to Excel successfully.',
            });
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            toast({
                title: 'Export failed',
                description: error instanceof Error ? error.message : 'Failed to export report. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-1">Report Builder</h2>
                    <p className="text-sm text-muted-foreground">
                        Drag fields from above to build your custom report
                    </p>
                </div>
                {columns.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                    </Button>
                )}
            </div>

            {/* Drop Zone - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="
                        min-h-[150px] border-2 border-dashed border-border rounded-lg p-6
                        transition-all duration-200
                    "
                >
                    {columns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                Drop Fields Here
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Drag vendor stats or questions from the blocks above to add them as columns in your report
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="secondary">{columns.length} columns</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {columns.map((column, index) => (
                                    <div
                                        key={index}
                                        className="
                                            flex items-center gap-2 px-3 py-2 rounded-lg
                                            bg-primary/10 border border-primary/20
                                        "
                                    >
                                        <Badge variant={column.type === 'vendor-stat' ? 'default' : 'secondary'} className="text-xs">
                                            {column.type === 'vendor-stat' ? 'Vendor' : 'Question'}
                                        </Badge>
                                        <span className="text-sm font-medium text-foreground">
                                            {column.displayName}
                                        </span>
                                        <button
                                            onClick={() => removeColumn(index)}
                                            className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Report Preview (if generated) */}
                {reportData && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            Report preview will appear here...
                        </p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 flex-shrink-0">
                <Button
                    onClick={generateReport}
                    disabled={columns.length === 0 || !clientId || isGenerating}
                    className="flex-1"
                >
                    <Play className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
                <Button
                    variant="outline"
                    onClick={exportToExcel}
                    disabled={!reportData}
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                </Button>
            </div>

            {/* Report Dialog - Shows generated report in a table */}
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Generated Report</DialogTitle>
                        <DialogDescription>
                            {reportData?.rows?.length || 0} rows × {reportData?.columnHeaders?.length || 0} columns
                        </DialogDescription>
                    </DialogHeader>

                    {reportData && (
                        <div className="flex-1 overflow-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead className="sticky top-0 bg-muted">
                                    <tr>
                                        {reportData.columnHeaders?.map((header: string, idx: number) => (
                                            <th
                                                key={idx}
                                                className="border border-border px-3 py-2 text-left font-semibold bg-muted"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.rows?.map((row: any, rowIdx: number) => (
                                        <tr key={rowIdx} className="hover:bg-muted/50">
                                            {reportData.columnHeaders?.map((header: string, colIdx: number) => (
                                                <td
                                                    key={colIdx}
                                                    className="border border-border px-3 py-2"
                                                >
                                                    {row[header] || 'N/A'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                            Close
                        </Button>
                        <Button onClick={exportToExcel}>
                            <Download className="h-4 w-4 mr-2" />
                            Export to Excel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
