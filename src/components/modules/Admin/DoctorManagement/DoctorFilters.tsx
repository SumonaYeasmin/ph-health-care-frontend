"use client";
import RefreshButton from "@/src/components/shared/RefreshButton";
import SearchFilter from "@/src/components/shared/SearchFilter";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/src/components/ui/command";
import { Input } from "@/src/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { useDebounce } from "@/src/hooks/useDebounce";
import { ISpecialty } from "@/types/specialities.interface";
import { Check, ChevronsUpDown, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface DoctorsFilterProps {
    specialties: ISpecialty[];
}

const DoctorFilters = ({ specialties }: DoctorsFilterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    
    // পপওভার ওপেন/ক্লোজ স্টেট
    const [open, setOpen] = useState(false);
    
    // ইউজার যে স্পেশালিটিগুলো সিলেক্ট করছে তা সাময়িকভাবে লোকাল স্টেটে জমা রাখার জন্য
    const [localSpecialties, setLocalSpecialties] = useState<string[]>(
        () => searchParams.getAll("specialties") || []
    );
    
    // জেন্ডার ফিল্টারের ইনপুট স্টেট
    const [genderInput, setGenderInput] = useState(
        () => searchParams.get("gender") || ""
    );
    
    // ইমেইল দিয়ে ফিল্টার করার লোকাল স্টেট
    const [emailInput, setEmailInput] = useState(
        () => searchParams.get("email") || ""
    );
    
    // ফোন নম্বর দিয়ে ফিল্টার করার লোকাল স্টেট
    const [contactNumberInput, setContactNumberInput] = useState(
        () => searchParams.get("contactNumber") || ""
    );
    
    // সর্টিং (sortBy) অপশন স্টোর করার স্টেট
    const [sortByInput, setSortByInput] = useState(
        () => searchParams.get("sortBy") || ""
    );

    // কী-বোর্ড টাইপিংয়ের সাথে সাথে যেন প্রতিবার ব্যাকএন্ড এপিআই কল না হয়, সেজন্য ডিবান্সিং (Debounce) করা হয়েছে
    const debouncedGender = useDebounce(genderInput, 300);
    const debouncedEmail = useDebounce(emailInput, 500);
    const debouncedContactNumber = useDebounce(contactNumberInput, 500);

    // ইনপুট ভ্যালুগুলোর পরিবর্তন ট্র্যাকিং করে ইউআরএল (URL Query Parameters) আপডেট করার ইফেক্ট
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Update debounced fields
        if (debouncedGender) {
            params.set("gender", debouncedGender);
        } else {
            params.delete("gender");
        }

        if (debouncedEmail) {
            params.set("email", debouncedEmail);
        } else {
            params.delete("email");
        }

        if (debouncedContactNumber) {
            params.set("contactNumber", debouncedContactNumber);
        } else {
            params.delete("contactNumber");
        }

        if (sortByInput && sortByInput !== "all") {
            if (sortByInput.includes("-")) {
                const [sortBy, sortOrder] = sortByInput.split("-");
                params.set("sortBy", sortBy);
                params.set("sortOrder", sortOrder);
            } else {
                params.set("sortBy", sortByInput);
            }
        } else {
            params.delete("sortBy");
            params.delete("sortOrder");
        }

        // যেকোনো ফিল্টার পরিবর্তন হলে পেজিনেশন পেজ ১-এ রিসেট হবে
        params.set("page", "1");

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedGender, debouncedEmail, debouncedContactNumber, sortByInput]);

    // স্পেশালিটি সিলেক্ট বা ডিসিলেক্ট (টগল) করার হেল্পার ফাংশন
    const toggleSpecialty = (specialtyId: string) => {
        const newSelection = localSpecialties.includes(specialtyId)
            ? localSpecialties.filter((id) => id !== specialtyId)
            : [...localSpecialties, specialtyId];

        setLocalSpecialties(newSelection);
    };

    // সিলেক্ট করা স্পেশালিটিগুলোকে ইউআরএল-এ অ্যাপ্লাই করার ফাংশন
    const applySpecialtyFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("specialties");
        if (localSpecialties.length > 0) {
            localSpecialties.forEach((val) => params.append("specialties", val));
        }
        params.set("page", "1");

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
        setOpen(false);
    };

    // সমস্ত সার্চ ইনপুট ও সিলেক্টেড ফিল্টার এক ক্লিকে মুছে দেওয়ার ফাংশন
    const clearAllFilters = () => {
        setGenderInput("");
        setEmailInput("");
        setContactNumberInput("");
        setSortByInput("");
        setLocalSpecialties([]);
        startTransition(() => {
            router.push(window.location.pathname);
        });
    };

    // বর্তমানে কয়টি ফিল্টার সচল আছে তা গণনা করার জন্য
    const activeFiltersCount =
        localSpecialties.length +
        (genderInput ? 1 : 0) +
        (emailInput ? 1 : 0) +
        (contactNumberInput ? 1 : 0) +
        (sortByInput && sortByInput !== "all" ? 1 : 0);

    return (
        <div className="space-y-3">
            {/* Row 1: Search and Refresh */}
            <div className="flex items-center gap-3">
                <SearchFilter paramName="searchTerm" placeholder="Search doctors..." />
                <RefreshButton />
            </div>

            {/* Row 2: Filter Controls */}
            <div className="flex items-center gap-3">
                {/* Specialties Multi-Select */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-60 justify-between h-10"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            {localSpecialties.length > 0
                                ? `${localSpecialties.length} selected`
                                : "Select specialties"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search specialties..." />
                            <CommandList>
                                <CommandEmpty>No specialty found.</CommandEmpty>
                                <CommandGroup>
                                    {specialties.map((specialty) => {
                                        const isSelected = localSpecialties.includes(
                                            specialty.title
                                        );
                                        return (
                                            <CommandItem
                                                key={specialty.id}
                                                value={specialty.title}
                                                onSelect={() => toggleSpecialty(specialty.title)}
                                                className={isSelected ? "bg-accent" : ""}
                                            >
                                                <Checkbox checked={isSelected} className="mr-2" />
                                                <span className={isSelected ? "font-medium" : ""}>
                                                    {specialty.title}
                                                </span>
                                                {isSelected && (
                                                    <Check className="ml-auto h-4 w-4 text-primary" />
                                                )}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                            <div className="p-2 border-t">
                                <Button
                                    onClick={applySpecialtyFilter}
                                    className="w-full"
                                    size="sm"
                                    disabled={isPending}
                                >
                                    Apply Filter
                                </Button>
                            </div>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Gender Filter */}
                <Select
                    value={genderInput}
                    onValueChange={(value: string) =>
                        setGenderInput(value === "all" ? "" : value)
                    }
                    disabled={isPending}
                >
                    <SelectTrigger className="w-[140px] h-10">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                </Select>

                {/* Email Filter */}
                <Input
                    type="email"
                    placeholder="Email"
                    value={emailInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value)}
                    className="w-[200px] h-10"
                    disabled={isPending}
                />

                {/* Contact Number Filter */}
                <Input
                    type="text"
                    placeholder="Contact"
                    value={contactNumberInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactNumberInput(e.target.value)}
                    className="w-40 h-10"
                    disabled={isPending}
                />

                {/* Sort By Filter */}
                <Select
                    value={sortByInput}
                    onValueChange={(value: string) =>
                        setSortByInput(value)
                    }
                    disabled={isPending}
                >
                    <SelectTrigger className="w-[160px] h-10">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Sort by: Default</SelectItem>
                        <SelectItem value="appointmentFee-asc">Fee: Low to High</SelectItem>
                        <SelectItem value="appointmentFee-desc">Fee: High to Low</SelectItem>
                        <SelectItem value="experience-asc">Experience: Low to High</SelectItem>
                        <SelectItem value="experience-desc">Experience: High to Low</SelectItem>
                    </SelectContent>
                </Select>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        disabled={isPending}
                        className="h-10 px-3"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear ({activeFiltersCount})
                    </Button>
                )}
            </div>

            {/* Row 3: Active Specialty Badges - Fixed Height to Prevent Shift */}

            {localSpecialties.length > 0 && (
                <div className="min-h-8 flex items-center">
                    <div className="flex flex-wrap gap-2">
                        {localSpecialties.map((specialtyTitle) => (
                            <Badge
                                key={specialtyTitle}
                                variant="outline"
                                className="px-2.5 py-1 h-7"
                            >
                                {specialtyTitle}
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleSpecialty(specialtyTitle)}
                                    className="ml-1.5 hover:text-destructive transition-colors"
                                    aria-label={`Remove ${specialtyTitle}`}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorFilters;